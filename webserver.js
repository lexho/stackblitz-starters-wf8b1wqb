import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';

import { getConfig } from './model.js'
import { getContent, getNotes } from './model_async.js';
import { saveAction, formAction } from './controller.js';


const app = express();

app.set('view engine', 'ejs')

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
app.use(express.json())

app.use(morgan('common', { immediate: true }));

app.use(express.urlencoded({ extended: false }));

export let routes = []; //[ { "path": "/", "label": "home"} ] 
export let content = [];
export let todo = [];
let issues = [];

let cfg1 = { websitetitle: "Alexander's Seite", loadOnTheFly: true, build: "" }
try {
    cfg1 = JSON.parse(getConfig()); // load config from config.json
    console.log(cfg1)
} catch(err) {
    console.log(err)
}
const cfg = cfg1;
export const cfg2 = { build: cfg.build, version: cfg.version }

async function loadContentFromFile() {
    try {
        content = JSON.parse(await getContent());
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    if(cfg.build == "debug") {
        try {
            todo = JSON.parse(await getNotes()).todolist;
        } catch(err) {
            console.error("Error: 'todo' cannot be parsed. check './config/editorsnotes.json' for syntax errors.")
        }
        try {
            issues = JSON.parse(await getNotes()).issues;
        } catch(err) {
            console.error("Error: 'issues' cannot be parsed. check './config/editorsnotes.json' for syntax errors.")
        }
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
            else if(layout == "text-with-gallery")
                res.render('text-with-gallery', { websitetitle: websitetitle, title: title, routes: routes, id: page.id, text: text, images: images, todo: todo, cfg: cfg2})
            
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