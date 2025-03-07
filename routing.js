import { Router } from 'express';
import multer from 'multer';
import { access, constants } from 'node:fs/promises';

import { getContent, loadContentFromFile, getNotes, loadNotesFromFile, getPageById } from './models/model_async.js';
import { pageAction, saveSettingsAction, deleteAction, setupAction } from './controllers/page.controller.js';  
import { formAction, saveAction, saveImageFilesAction } from './controllers/form.controller.js';  
import { Guestbook } from './modules/guestbook.js'
import { HomePage, SetupPage, SettingsPage } from './views/page.js';
import { loadConfig1, print, modulesEnabled, isDebug, getPageConfig } from './config.js'
//import config from './config.js'


await loadContentFromFile()
loadConfig1();
print();

const guestbook = new Guestbook();

if(modulesEnabled()) {
    guestbook.install()
}

/** set up get request handlers for pages 
 * @param {string} router - the express routing module.
 * @param {string} content - the content of the website.
 * @param {string} pageAction - the page action in the controller.
*/
export async function setAppGetPages1(router, content, getPageById, pageAction, buildRoutes, setAppGet) {
    console.log("set app GET pages")

    for(const page of content.pages) {
        let route = page.path
        let id = page.id
        
        router.get(route, (req, res, next) => {
            req.id = id
            pageAction(req, res, next);
        });
    }
    router.get("textblock1", (req, res, next) => {
        req.id = id
        pageAction(req, res, next);
    });
    //buildRoutes();
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
            const page = new SetupPage("setup", "Website Setup")
            page.render(res)
        } else {
            if(isDebug()) {
                try {
                    let notes = getNotes()
                    const page = new HomePage(notes.todolist, notes.issues)
                    page.render(res)
                } catch(err) {
                    console.error(err)
                    const page = new HomePage()
                    page.render(res)
                }
            } else {
                const page = new HomePage()
                page.render(res)
            }
        }
    })
    router.get('/setup', (req,res) => {
        const page = new SetupPage("setup", "Website Setup")
        page.render(res)
    })
    const upload1 = multer({ dest: 'uploads/' }).single('avatar')
    router.post('/setup/save', upload1, setupAction)
    router.get('/page/new/:path?', (req, res) => { 
        formAction(req, res)
    });
    router.get('/page/delete/:id?', (req, res) => { 
        req.cfg = getPageConfig();
        deleteAction(req, res)
    });
    router.get('/settings', (req,res)=>{
        const page = new SettingsPage('/settings', "Settings")
        page.render(res)
    });

    router.post('/settings/save', saveSettingsAction)
    
    if(modulesEnabled()) {
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

    router.post('/page/save', upload, saveAction)
    router.post('/image/save', upload, saveImageFilesAction)
}

if(isDebug()) {
    try {
        await loadNotesFromFile()
    } catch(err) {
        console.error(err)
    }
}

const router = Router();

setAppGetPages1(router, getContent(), getPageById, pageAction, ()=> {}, setAppGet)

export async function setAppGetPages() {
    return setAppGetPages1(router, getContent(), getPageById, pageAction, () => {}, setAppGet);
}

export { router };