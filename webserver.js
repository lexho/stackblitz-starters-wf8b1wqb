import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

import { getContent, getNotes, getConfig, save } from './model_async.js';

const app = express();

app.set('view engine', 'ejs')

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))

app.use(morgan('common', { immediate: true }));

app.use(express.urlencoded({ extended: false }));

let routes = []; //[ { "path": "/", "label": "home"} ] 
let content = [];
let todo = [];
let issues = [];

/*let sitetitle1 = "Alexander's Seite"
let loadOnTheFly1 = ""
let build1 = ""*/
let cfg1 = { websitetitle: "Alexander's Seite", loadOnTheFly: true, build: "" }
try {
    cfg1 = JSON.parse(await getConfig()); // load config from config.json
    console.log(cfg1)
    /*sitetitle1 = cfg.websitetitle
    loadOnTheFly1 = cfg.loadOnTheFly
    build1 = cfg.build*/
    //cfg0 = { sitetitle: cfg1.websitetitle, loadOnTheFly: cfg1.loadOnTheFly, build: cfg1.build }
} catch(err) {
    console.log(err)
}
/*const sitetitle = sitetitle1
const loadOnTheFly = loadOnTheFly1
const build = build1*/
const cfg = cfg1;
const cfg2 = { build: cfg.build, version: cfg.version }

async function loadContentFromFile() {
    try {
    content = JSON.parse(await getContent());
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    if(cfg.build == "debug") {
        todo = JSON.parse(await getNotes()).todolist;
        issues = JSON.parse(await getNotes()).issues;
    }
    //routes = [ { "path": "/", "label": "home"} ] ;
    routes = [] ;
    for(let page of content.pages) {
        routes.push({ path: page.path, label: page.title })
    }
    routes.push({ path: '/page/new', label: "New" })
    setAppGetPages();
}

async function saveAction(request, response) {
    /*const page = {
        id: request.body.id,
        layout: request.body.layout,
        title: request.body.title,
        text: request.body.text,
        path: "/" + request.body.title.toLowerCase().replaceAll(" ", "")
    };*/
    const page = {
        id: request.body.id,
        layout: request.body.layout,
        title: request.body.title,
        text: request.body.text,
        path: "/" + request.body.title.toLowerCase().replaceAll(" ", ""),
        images: [{"url":request.body.foto1,"alt":""}, {"url":request.body.foto2,"alt":""}, {"url":request.body.foto3,"alt":""}]
    };
    console.log();
    console.log("updated page: ")
    console.log(page)
    console.log();
    await save(page)
    await loadContentFromFile();
    //response.send("gespeichert")
    //response.render('form', { websitetitle: content.websitetitle, routes: routes, id: page.id, title: page.title, text: page.text, todo: todo })
    response.redirect("/");
}

async function formAction(request, response) {
    let page = { id: '', title: '', text: '' }
    if(request.params.id) {
        let content1 = JSON.parse(await getContent());
        page = content1.pages[parseInt(request.params.id, 10)-1]
    }
    const id = page.id;
    const path = page.path;
    const layout = page.layout;
    const title = page.title;
    const text = page.text;
    response.render('edit', { websitetitle: content.websitetitle, routes: routes, id: id, path: path, layout: layout, title: title, text: text, todo: todo, cfg: cfg2 })
}

function setAppGetPages() {
    for(let page of content.pages) {
        let route = page.path
        //let page1 = content.pages.find(field => field.id == page.id)
        
        app.get(route, async (req,res)=>{
            if(cfg.loadOnTheFly) await loadContentFromFile();
            //console.log("route: " + route)
            //console.log(content.pages)
            /*console.log("length:" + content.pages.length)
            for(let page of content.pages) {
                console.log(page.id + " " + page.title)
            }
            console.log(page.id)*/
            let page1 = content.pages[page.id-1]
            //let page1 = content.pages.byID(page.id)
            //console.log(page1.id)
            const layout = page1.layout;
            const websitetitle = content.websitetitle;
            const title = page1.title;
            const text = page1.text;
            const images = page1.images;
            /*const layout = page.layout;
            const websitetitle = content.websitetitle;
            const title = page.title;
            const text = page.text;
            const images = page.images*/
            //console.log(page.title)
            //console.log(title)
            
            // View with content
            if(layout == "text-with-title")
                res.render('text-with-title', { websitetitle: websitetitle, title: title, routes: routes, id: page.id, text: text, todo: todo, cfg: cfg2})
            else if(layout == "gallery")
                res.render('gallery', { websitetitle: websitetitle, title: title, routes: routes, id: page.id, images: images, todo: todo, cfg: cfg2})
            else
                res.render('index', { websitetitle: websitetitle, title: title, routes: routes, id: page.id, text: text, todo: todo, cfg: cfg2})
        });
    }
    app.get('/', (req,res)=>{
        if(cfg.loadOnTheFly) loadContentFromFile();
        res.render('home', { websitetitle: cfg.websitetitle, routes: routes, text: "", todo: todo, issues: issues, cfg: cfg2 })
    });
    app.get('/page/new/:id?', formAction);
    app.post('/page/save', saveAction)
}

loadContentFromFile();

app.listen(8080, () => {
    console.log('App erreichbar unter http://localhost:8080')
});