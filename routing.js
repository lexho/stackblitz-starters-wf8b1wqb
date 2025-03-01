import { Router } from 'express';
import multer from 'multer';
import ejs from 'ejs';

import { loadConfig } from './model.js'
import { getContent, loadContentFromFile, getNotes, loadNotesFromFile, getPageById } from './model_async.js';
import { pageAction, saveAction, saveSettingsAction, formAction, deleteAction, setupAction } from './controller.js';

import { Guestbook } from './modules/guestbook.js'
import { access, constants } from 'node:fs/promises';

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

/** get releveant config for page */
export function getPageConfig() {
    const cfg_page = {}
    cfg_page.routes = cfg.routes
    let content = getContent()
    cfg_page.websitetitle = content.websitetitle
    cfg_page.style = cfg.style
    return cfg_page
}

export function setStyle(style) {
    cfg.style = style
}

const guestbook = new Guestbook();
if(cfg.enableModules) {
    guestbook.install()
}

/*if(cfg.build == "debug") {
    let notes = await getNotesFromFile()
    let todo = []
    let issues = []

    if(!typeof notes.todolist === undefined) {
        todo = notes.todolist;
    }
    if(!typeof notes.issues === undefined) {
        issues = notes.issues;
    }
    cfg.todo = todo;
    cfg.issues = issues;
}*/
//routes = [ { "path": "/", "label": "home"} ] ;

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

/** set up get request handlers for pages 
 * @param {string} router - the express routing module.
 * @param {string} content - the content of the website.
 * @param {string} pageAction - the page action in the controller.
*/
export async function setAppGetPages1(router, content, getPageById, pageAction, buildRoutes, setAppGet) {
    console.log("set app GET pages")

    /*console.log("content page 1: " + JSON.stringify(content.pages[0]))
    console.log("content length: " + JSON.stringify(content.pages.length))*/

    for(const page of content.pages) {
        let route = page.path
        let id = page.id
    
        router.get(route, (req, res) => {
            req.page = getPageById(id) // callback function will be called when someone clicks an item from your menu
                                            // to get accurate page data you have to use 'getPageByID' and not 'page'
            req.cfg = getPageConfig() //cfg
            pageAction(req, res)
        });
    }
    buildRoutes();
    setAppGet()
}

/** set up get request handlers for undeleteable, fixed pages like home, 
 * page/new, page/save, page/delete, /settings
*/
function setAppGet() {
    router.get('/', async(req,res) => {
        // content
        //let content = getContent()
        //content.websitetitle
        // keine content.json?
        // keine config?
        let firsttime = false;
        try {
            await access('config/content.json', constants.R_OK | constants.W_OK);
        } catch(error) {
            // config/content.json does not exist
            firsttime = true
        }
        if(firsttime) {
            const page_cfg = getPageConfig()
            res.render('setup', { title: "Website Setup", cfg: page_cfg})
        } else {
            const page_cfg = getPageConfig()
            if(cfg.build == "debug") {
                let notes = getNotes()
                let todo = []
                let issues = []
                todo = notes.todolist;
                issues = notes.issues;
                page_cfg.todo = todo;
                page_cfg.issues = issues;
            }
            //TODO cfg soll hier vielleicht gar nich verfügbar sein
            res.render('home', { cfg: page_cfg, websitetitle: page_cfg.websitetitle, text: "" })
            //res.end("home")
        }
    })
    router.get('/setup', (req,res) => {
        const page_cfg = getPageConfig()
        res.render('setup', { title: "Website Setup", cfg: page_cfg})
    })
    const upload1 = multer({ dest: 'uploads/' }).single('avatar')
    router.post('/setup/save', upload1, setupAction)
    router.get('/page/new/:path?', (req, res) => { 
        req.cfg = getPageConfig();
        formAction(req, res)
    });
    router.get('/page/delete/:id?', (req, res) => { 
        req.cfg = getPageConfig();
        deleteAction(req, res)
    });
    router.get('/settings', (req,res)=>{
        const cfg = getPageConfig()
        res.render('settings', {cfg: cfg, title: "Settings", checked: cfg.style })
    });

    router.post('/settings/save', saveSettingsAction)
    
    if(cfg.enableModules) {
        router.get(guestbook.route, (req, res) => {
            req.cfg = getPageConfig()
            guestbook.action(req, res)
        })
    }
    const upload = multer({
        dest: 'uploads/',
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
                const err = new Error('Only .png, .jpg and .jpeg format allowed!')
                err.name = 'ExtensionError'
                return cb(err);
            }
        },
    }).array('photos', 50)
    //router.post('/page/save', saveAction)
    router.post('/page/save', upload, saveAction) 
}

//getContentFromFileSync()
//await getContentFromFile()
buildRoutes()
if(cfg.build == "debug") await loadNotesFromFile()

const router = Router();

setAppGetPages1(router, getContent(), getPageById, pageAction, buildRoutes, setAppGet)

export async function setAppGetPages() {
    return setAppGetPages1(router, getContent(), getPageById, pageAction, buildRoutes, setAppGet);
}

export { router };