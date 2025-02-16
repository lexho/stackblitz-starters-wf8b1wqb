import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import ejs from 'ejs';

import { getConfig } from './model.js'
import { getContent, getNotes } from './model_async.js';
import { pageAction, saveAction, saveSettingsAction, formAction } from './controller.js';

import { Guestbook } from './modules/guestbook.js'

const app = express();

app.set('view engine', 'ejs')

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
app.use(express.json())

app.use(morgan('common', { immediate: true }));

app.use(express.urlencoded({ extended: false }));

let routes = []; //[ { "path": "/", "label": "home"} ] 
let content = [];
let todo = [];
let issues = [];

const cfg = {
    "websitetitle": "",
    "version": "0.0",
    "build": "debug",
    "loadOnTheFly": false,
    "enableModules": false
}

try {
    const cfg1 = JSON.parse(getConfig()); // load config from config.json
    cfg.websitetitle = cfg1.websitetitle
    cfg.version = cfg1.version
    cfg.build = cfg1.build
    cfg.loadOnTheFly = cfg1.loadOnTheFly
    cfg.enableModules = cfg1.enableModules
    console.log(cfg)
} catch(err) {
    console.log(err)
}
cfg.routes = routes;
cfg.todo = todo;
cfg.issues = issues;

const guestbook = new Guestbook();
if(cfg.enableModules) {
    guestbook.install()
}

/** loads content from .json files */
/*async function loadContentFromFile() {
    console.log("load content from file")
    try {
        content = JSON.parse(getContentFromFileSync())
        //console.log(content)
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    if(cfg.build == "debug") {
        try {
            todo = getNotes().todolist;
        } catch(err) {
            console.error("Error: 'todo' cannot be parsed. check './config/editorsnotes.json' for syntax errors.")
        }
        try {
            issues = getNotes().issues;
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
    routes.push({ path: '/settings', label: "Settings" })
    cfg.routes = routes;
    cfg.style = content.style
    cfg.todo = todo;
    cfg.issues = issues;
    setAppGetPages();
}*/

/** load content from RAM */
async function loadContent() {
    try {
        content = await getContent();
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    if(cfg.build == "debug") {
        try {
            /*console.log(getNotes())
            console.log(await getNotes())
            console.log(await getNotes()).todolist*/
            todo = (await getNotes()).todolist;
        } catch(err) {
            console.error("Error: 'todo' cannot be parsed. check './config/editorsnotes.json' for syntax errors.")
        }
        try {
            issues = await getNotes().issues;
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
    routes.push({ path: '/settings', label: "Settings" })
    cfg.routes = routes;
    cfg.style = content.style
    cfg.todo = todo;
    cfg.issues = issues;
    setAppGetPages();
}

/** setup get request handlers for pages */
function setAppGetPages() {
    console.log("set app pages")
    //console.log(content.pages)
    for(let page of content.pages) {
        let route = page.path
        app.get(route, (req, res) => {
            if(cfg.loadOnTheFly) loadContent();
            req.page = content.pages[page.id-1]
            req.cfg = cfg
            pageAction(req, res)
        });
    }
    app.get('/', (req,res)=>{
        if(cfg.loadOnTheFly) loadContent();
        res.render('home', { cfg: cfg, websitetitle: cfg.websitetitle, text: "" })
    });
    app.get('/page/new/:id?', (req, res) => { 
        req.cfg = cfg;
        formAction(req, res)
    });
    app.get('/settings', (req,res)=>{
        if(cfg.loadOnTheFly) loadContent();
        res.render('settings', {cfg: cfg, title: "Settings", checked: cfg.style })
    });
    
    if(cfg.enableModules) {
        //const guestbook = { "route": "/guestbook", action: guestbookModuleAction }
        //guestbook.route
        app.get(guestbook.route, (req, res) => {
            req.cfg = cfg
            guestbook.action(req, res)
        })
        /*const modules = [guestbook];
        for(let module of modules) {
            app.get(module.route, (req, res) => { 
                //req.page = content.pages[page.id-1]
                req.routes = routes
                req.todo = todo
                req.cfg = cfg2
                req.content = content
                req.loadContentFromFile = loadContentFromFile
                module.action(req, res) 
            })
            //() => {}
            //app.get(module.route, (req, res) => {})
            //app.get(module.route, moduleAction)
        }*/
    }
    app.post('/page/save', saveAction)
    app.post('/settings/save', saveSettingsAction)
    app.use((req, res, next) => {
        const file = "views/error.ejs"
        const params = { title: "Error 404", message: "Seite nicht gefunden.", cfg: cfg }
        ejs.renderFile(file, params, (err, html) => {
            res.status(404).send(html)
        });
    })
    app.use((err, req, res, next) => {
        console.error(err.stack)
        const file = "views/error.ejs"
        const params = { title: "Error 500", message: "Internal Server Error.", cfg: cfg }
        ejs.renderFile(file, params, (err, html) => {
            res.status(500).send(html)
        });
    })
}

loadContent()
//getContentFromFileSync()

/** this is an express webserver */
const server = app.listen(8080, () => { // port 8189 for performance test 
    console.log('App erreichbar unter http://localhost:8080')
});

process.on('SIGTERM', () => {
    debug('SIGTERM signal received: closing HTTP server')
    server.close(() => {
        debug('HTTP server closed')
    })
})  