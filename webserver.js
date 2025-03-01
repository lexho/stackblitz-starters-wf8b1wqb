import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
//import removeRoute from 'express-remove-route'; // phantom pages

//import { router, getPageConfig } from './routing.js';
import { writeToFile } from './storage_ram.js';
import ejs from 'ejs';
import { getConfig } from './model_async.js'
import { loadConfig } from './model.js'
import { getContent, loadContentFromFile, getNotes, loadNotesFromFile, getPageById } from './model_async.js';

import { Subject, of } from 'rxjs';
import { tap, filter, map, catchError, every } from 'rxjs/operators';

import { pageAction } from './controller.js'
import { Router } from 'express';

let app;
const router = Router()
const subject1 = new Subject();
let subjects = [];

export let cfg = {
    "websitetitle": "",
    "version": "0.0",
    "build": "debug",
    "loadOnTheFly": false,
    "enableModules": false,
    "style": undefined
}

try {
    const cfg1 = JSON.parse(loadConfig()); // load config from config.json
    cfg.websitetitle = cfg1.websitetitle
    cfg.version = cfg1.version
    cfg.build = cfg1.build
    cfg.loadOnTheFly = cfg1.loadOnTheFly
    cfg.enableModules = cfg1.enableModules
    
    await loadContentFromFile()
    const content = getContent()
    console.log("style: " + content.style)
    cfg.style = content.style

    console.log(cfg)
} catch(err) {
    console.log(err)
}

export async function buildRoutes() {
    console.log("build routes")
    let routes = [];
    let content = getContent() //TODO remove
    //let obj = {"websitetitle": "", "style": "stylecss", "page": "mypage", "pages": []}
    //if(typeof content === undefined) 
    //let content = new Content(obj) //
    for(let page of content.pages) {
        routes.push({ path: page.path, label: page.title })
    }
    routes.push({ path: '/page/new', label: "Neue Seite" })
    routes.push({ path: '/settings', label: "Settings" })
    cfg.routes = routes;
    if(!typeof content.style === undefined)  cfg.style = content.style
}

/** get releveant config for page */
export function getPageConfig() {
    const cfg_page = {}
    cfg_page.routes = cfg.routes // TODO fix
    let content = getContent()
    cfg_page.websitetitle = content.websitetitle
    cfg_page.style = cfg.style
    return cfg_page
}

export async function setAppGetPages() {
    buildSubjects();
    console.log("set app get pages")
    let content = getContent()
    router.get('/', (req, res, next) => subject1.next({ req, res, next }));
    //router.get('/page/new/:id?', formAction);
    //router.post('/page/save', saveAction)
    for(let i = 0; i < content.pages.length; i++) {
    //for(const page of content.pages) {
        const page = content.pages[i]
        let route = page.path
        let id = page.id
    
        router.get(route, async (req, res, next) => subjects[i].next({ req, res, next }));
    }
    buildRoutes();
    //setAppGet()
}

export function setStyle(style) {
    cfg.style = style
}

function buildSubjects() {
    subjects = []
    let content = getContent()
    for(let i = 0; i < content.pages.length; i++) {
        subjects.push(new Subject())
        console.log("new subject")
        //for(let page of content.pages) {
        let page = content.pages[i]
        let subject = subjects[i]
        subject
            .pipe(
                tap(({ req }) => console.log('Request received:', req.url)),
                map(({ req, res, next}) => {
                    // will be called when someone clicks an item from your menu
                    // to get accurate page data you have to use 'getPageByID' and not 'page'
                    const id = page.id
                    req.page = getPageById(id)
                    req.cfg = getPageConfig()
                    if(req.page !== undefined) console.log("not undefined")
                    return { req, res, next}
                }),
                catchError((e, caught) => {
                    console.log("error was " + e)
                    return of('test3', 'test4')
                }),
            )
            .subscribe(async ({ req, res, next }) => {
                
                //function next(err) { console.log(err)}
                await pageAction({ req, res, next })
            });
    }
}

subject1
    .pipe(
        tap(({ req }) => console.log('Request received:', req.url))
    )
    .subscribe(({ req, res }) => {
        const page_cfg = getPageConfig()
        res.render('home', { cfg: page_cfg, websitetitle: page_cfg.websitetitle, text: "" })
    });

export function start() {
    app = express(); // TODO changed

    app.set('view engine', 'ejs')

    app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
    app.use(express.json())

    app.use(morgan('common', { immediate: true }));

    app.use(express.urlencoded({ extended: false }));

    // doda
    app.use('/', router); // (req, res, next) => { next() }

    //app.use('/', router); // (req, res, next) => { next() }
    //app.get('/', (req, res) => subject1.next({ req, res }));

    // da kein router, deaktivieren
    app.use((req, res, next) => {
        const cfg = getPageConfig() // page config
        res.render('error', {  title: "Error 404", message: "Seite nicht gefunden.", stacktrace: "", cfg: cfg })
        //res.status(404).send('Sorry cant find that!')
    })
    app.use(async(err, req, res, next) => {
        console.error(err.code)
        console.error(err.message)
        console.error(err.stack)
        let message = "Internal Server Error."
        let stack = ""
        const cfg1 = await getConfig()
        if(cfg1.build == "debug") stack = err.stack;
        const cfg = getPageConfig()
        res.render('error', { title: "Error 500", message: message, stacktrace: stack, cfg: cfg } )
        //res.status(500).send('Something broke!')
    })

    buildRoutes();
    setAppGetPages();
}

export function stop() {
    server.close(async() => {
        console.log('HTTP server closed')
        await writeToFile()
    })
}

start();
/*export function removeRoute1(route) {
    removeRoute(app, route);
}*/

/** this is an express webserver */
const server = app.listen(8081, () => { // port 8189 for performance test 
    console.log('App erreichbar unter http://localhost:8081')
});

// Using a single function to handle multiple signals
function handle(signal) {
    console.log(`Received ${signal}`);
    server.close(async() => {
        console.log('HTTP server closed')
        await writeToFile()
    })
  }

process.on('SIGINT', handle);
process.on('SIGTERM', handle);