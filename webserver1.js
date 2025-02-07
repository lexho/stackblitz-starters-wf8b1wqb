import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

import { getContent, getNotes, getConfig } from './model_async.js';
import { saveAction, formAction } from './controller.js';

const app = express();

app.set('view engine', 'ejs')

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))

app.use(morgan('common', { immediate: true }));

app.use(express.urlencoded({ extended: false }));

export let routes = []; //[ { "path": "/", "label": "home"} ] 
export let content = [];
export let todo = [];
let issues = [];

const cfg = await loadConfig();
export const cfg2 = { build: cfg.build, version: cfg.version }
await loadContentFromFile();

async function loadConfig() {
    let cfg1 = { websitetitle: "Alexander's Seite", loadOnTheFly: true, build: "" }
    try {
        cfg1 = JSON.parse(await getConfig()); // load config from config.json
        console.log(cfg1)
        return cfg1;
    } catch(err) {
        console.log(err)
    }
}

async function loadContentFromFile1() {
    try {
        console.log(await getContent());
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
    routes.push({ path: '/page/new', label: "Neue Seite" })
    setAppGetPages();
}

async function loadContentFromFile() {
    try {
        //console.log(await getContent());
        content = JSON.parse(await getContent());
        console.log(content)
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    let cfg = loadConfig()
    if(cfg.build == "debug") {
        todo = JSON.parse(await getNotes()).todolist;
        issues = JSON.parse(await getNotes()).issues;
    }
    //routes = [ { "path": "/", "label": "home"} ] ;
    routes = [] ;
    for(let page of content.pages) {
        routes.push({ path: page.path, label: page.title })
    }
    routes.push({ path: '/page/new', label: "Neue Seite" })
    setAppGetPages();
}

function setAppGetPages() {
    for(let page of content.pages) {
        let route = page.path
        
        app.get(route, async (req,res)=>{
            if(cfg.loadOnTheFly) await loadContentFromFile();
            let page1 = content.pages[page.id-1]
            const layout = page1.layout;
            const websitetitle = content.websitetitle;
            const title = page1.title;
            const text = page1.text;
            const images = page1.images;
            
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

app.listen(8080, () => {
    console.log('App erreichbar unter http://localhost:8080')
});