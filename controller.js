import { copyFile, unlinkSync } from 'fs';
import sharp from 'sharp';
import { replaceUmlaute } from './utility.js';
import { getContent, save, deletePage, getPageByPath, saveSettings, saveSetup } from './model_async.js';
import { setAppGetPages } from './routing.js';
//import { removeRoute1 } from './webserver.js';

/** 
 * set parameter to render page
 * @param {Object} req - request which contains page and config data
 * @param {Object} res - rendered response of the webserver
 */
export async function pageAction({ req, res, next }) {
    try {
        const page = req.page // extract
        const cfg = req.cfg // extract

        // usin path instead of id
        const path = page.path // extract
        const layout = page.layout; // extract
        const title = page.title; // extract
        const text = page.text; // extract
        const images = page.images; // extract
        
        // View with content
        if(layout == "text-with-title")
            res.render('text-with-title', { cfg: cfg, title: title, path: path, text: text })
        else if(layout == "gallery")
            res.render('gallery', { cfg: cfg, title: title, path: path, images: images })
        else if(layout == "text-with-gallery")
            res.render('text-with-gallery', { cfg: cfg, title: title, path: path, text: text, images: images})
        
        else
            res.render('index', { cfg: cfg, title: title, path: path, text: text})
    } catch(err) {
        next(err);
    }
}

/** 
 * generates new page or edit;
 * @param {Object} req - request with params contain page path
 * @param {Object} res - response sends page data to a form to be editable or sends a empty form for a new page
 */
export async function formAction(req, res, next) {
    return formAction1(req, res, getPageByPath, next)
}

export async function formAction1(req, res, getPageByPath, next) {
    const cfg = req.cfg
    try {
        if(req.params.path === undefined) throw new Error("no path error") // path does not exist yet --> new page
        const path = req.params.path
        console.log("edit")
        console.log("path: " + path)
        let page = { id: '', title: '', text: '' }
        page = getPageByPath("/" + path) // TODO remove "/"
        //console.log("page: " + JSON.stringify(page))
        if(page === undefined) { 
            throw new Error("Error. Page not found.") // path is wrong --> new page?
            //response.end("Error. Page not found."); return; 
        }
        const id = page.id

        //const path = page.path;
        const layout = page.layout;
        const title = page.title;
        const text = page.text;
        res.render('edit', { cfg: cfg, title: title, id: id, path: path, layout: layout, heading: title, text: text })
    } catch(err) {
        console.log("new")
        // TODO prüfen
        const id = 0;
        const path = "";
        const layout = "";
        const title1 = "Neue Seite";
        const title = "";
        const text = "";
        res.render('form', { cfg: cfg, title1: title1, id: id, path: path, layout: layout, title: title, text: text })
        //next(err);
    }
}

/** 
 * deletes a page 
 * @param {Object} req - request which contains page id
 * @param {Object} res - response reloads the page
*/
export async function deleteAction(req, res) {
    console.log("delete")
    //removeRoute1(route) // remove page route from express stack
    await deletePage(req.params.id)
    //res.end("page " + req.params.id + "deleted.")

    res.redirect("/");
}

function contains(content, route) {
    for(const entry of content.pages) {
        if(route == entry.path) return true;
    }
}

// Duplikate vermeiden
// wenn neue seite == bestehender eintrag
export function uniquePath(content, path) {
    let route = path
    while(contains(content, route)) {
        console.log("routing table already contains route: " + route)
        //removeRoute(app, route);
        route += 1
        console.log("+1")
    }
    //routingTable.push({route: route, page: page})
    return route;
}

/** saves page to file 
 * @param {Object} req - request contains the page
 * @param {Object} res - response redirects to home
 * handle image upload
*/
export async function saveAction(req, res, next) {
    console.log("saveAction")
    // req.file
    // req.files
    // req.body will hold the text fields, if there were any
    const images = [];
    if(Array.isArray(req.files)) {
        // TODO verify content
        for(const file of req.files) {
            try {
                await sharp(file.path).resize().jpeg({ quality: 50 
                        }).toFile("public/images/" + file.originalname);
                unlinkSync(file.path);
                images.push({url: file.originalname, alt: ""})
            } catch(error) {
                //console.log(error) // do not create black holes, it's hard to get out of them
                next(error);
            }
        }
    } else {
        try {
            let file = req.file // extract
            copyFile(file.path, "public/images/" + file.originalname);
            images.push({url:  file.originalname, alt: ""})
        } catch(error) {
            next(error)
        }
    }

    let id
    if(req.body.id === undefined) id = 0;
    else id = req.body.id;
    const heading = req.body.heading
    const layout = req.body.layout
    const text = req.body.text
    const page = {
        id: id,
        layout: layout,
        title: heading,
        images: images,
        text: text,
        path: "/" + replaceUmlaute(heading.toLowerCase().replaceAll(" ", "")) // Duplikate möglich
    };

    if(page.id == 0) {
        page.path = uniquePath(getContent(), page.path)
    }

    try {
    await save(page)
    await setAppGetPages(); 
    res.redirect(page.path);
    } catch(error) {
        //console.error(error)
        next(error)
    }
}

/** setup website
 *  @param {Object} req - request with a websitetitle and an image 
*/
export async function setupAction(req, res, next) {
    console.log("setup action")
    let websitetitle = req.body.websitetitle // extrahiert
    let file = req.file // extrahiert
    try {
        await saveSetup(websitetitle, file) // errors --> pass errors to error handler via next
        res.redirect("/"); // to "home" page
    } catch(error) {
        // no file error, no website title error,...
        next(error); // pass errors to error handler via next
    }
}

/** saves the settings */
export async function saveSettingsAction(request, response) {
    return saveSettingsAction1(request, response, saveSettings);
}

export async function saveSettingsAction1(request, response, saveSettings) { // for test
    const settings = {
        style: request.body.style,
    };
    await saveSettings(settings) //ok    
    response.redirect("/");
}
