import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import ejs from 'ejs';

import { getConfig } from './model.js'
import { getContent, getNotes } from './model_async.js';
import { pageAction, saveAction, saveSettingsAction, formAction } from './controller.js';

import { Guestbook } from './modules/guestbook.js'
import { writeToFile } from './storage_ram.js';

const app = express();

app.set('view engine', 'ejs')

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
//app.use(express.json())

app.use(morgan('common', { immediate: true }));

app.use(express.urlencoded({ extended: false }));


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

const guestbook = new Guestbook();
if(cfg.enableModules) {
    guestbook.install()
}

if(cfg.build == "debug") {
    let todo = (await getNotes()).todolist;
    let issues = await getNotes().issues;
    cfg.todo = todo;
    cfg.issues = issues;
}
//routes = [ { "path": "/", "label": "home"} ] ;

async function buildRoutes() {
    let routes = [];
    const content = await getContent()
    for(let page of content.pages) {
        routes.push({ path: page.path, label: page.title })
    }
    routes.push({ path: '/page/new', label: "Neue Seite" })
    routes.push({ path: '/settings', label: "Settings" })
    cfg.routes = routes;
    cfg.style = content.style
}
buildRoutes();

/** setup get request handlers for pages */
export async function setAppGetPages() {
    //console.log("set app pages")
    //console.log(content.pages)
    const content = await getContent()
    buildRoutes();
    for(let page of content.pages) {
        let route = page.path
        //console.log("route: " + route)
        app.get(route, (req, res) => {
            req.page = content.pages[page.id-1]
            req.cfg = cfg
            pageAction(req, res)
        });
    }
    app.get('/', async (req,res)=>{
        let notes = await getNotes()
        let todo = notes.todolist;
        let issues = notes.issues;
        cfg.todo = todo;
        cfg.issues = issues;
        res.render('home', { cfg: cfg, websitetitle: cfg.websitetitle, text: "" })
    });
    app.get('/page/new/:id?', (req, res) => { 
        req.cfg = cfg;
        formAction(req, res)
    });
    app.get('/settings', (req,res)=>{
        res.render('settings', {cfg: cfg, title: "Settings", checked: cfg.style })
    });
    
    if(cfg.enableModules) {
        app.get(guestbook.route, (req, res) => {
            req.cfg = cfg
            guestbook.action(req, res)
        })
    }
    app.post('/page/save', saveAction)
    app.post('/settings/save', saveSettingsAction)
    /*app.use((req, res, next) => {
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
    })*/
}

setAppGetPages();
//getContentFromFileSync()

/** this is an express webserver */
const server = app.listen(8080, () => { // port 8189 for performance test 
    console.log('App erreichbar unter http://localhost:8080')
});

// Using a single function to handle multiple signals
function handle(signal) {
    console.log(`Received ${signal}`);
    server.close(() => {
        console.log('HTTP server closed')
        writeToFile()
    })
  }

  process.on('SIGINT', handle);
process.on('SIGTERM', handle);