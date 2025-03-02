import { copyFile } from 'node:fs/promises';
import sharp from 'sharp';
import { replaceUmlaute } from './public/js/utility.js';
import { getContent, save, deletePage, getPageById, getPageByPath, saveSettings, saveSetup } from './model_async.js';
import { setAppGetPages } from './routing.js';
//import { removeRoute1 } from './webserver.js';
import { TextWithTitle, Gallery, Index, TextWithGallery } from './page.js';
import { EditPage, FormPage } from './page.js'

/** 
 * set parameter to render page
 * @param {Object} req - request which contains page and config data
 * @param {Object} res - rendered response of the webserver
 */
export async function pageAction(req, res, next) {
    let page1
    let path
    try {
        const id = req.id
        page1 = getPageById(id)

        // usin path instead of id
        path = page1.path 
    } catch(error) {
        console.log("page not found")
        next()
    }
    try {
        const layout = page1.layout;

        //(websitetitle, routes, style)
        
        // View with content
        if(layout == "text-with-title") {
            const title = page1.title; 
            const text = page1.text; 
            const page = new TextWithTitle(path, title, text)
            //res.render('text-with-title', { cfg: cfg, title: title, path: path, text: text })
            page.render(res) }
        else if(layout == "gallery") {
            const title = page1.title; 
            const images = page1.images;
            const page = new Gallery(path, title, images)
            page.render(res) 
            //res.render('gallery', { cfg: cfg, title: title, path: path, images: images })

        } else if(layout == "text-with-gallery") {
            //res.render('text-with-gallery', { cfg: cfg, title: title, path: path, text: text, images: images})
            const title = page1.title; 
            const text = page1.text; 
            const images = page1.images; 
            const page = new TextWithGallery(path, title, text, images)
            page.render(res) 
        } else {
            //res.render('index', { cfg: cfg, title: title, path: path, text: text})
            const title = page1.title; 
            const text = page1.text; 
            const page = new Index(path, title, text)
            page.render(res) 
        }
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
    try {
        if(req.params.path === undefined) throw new Error("no path error") // path does not exist yet --> new page
        const path = req.params.path
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
        const page1 = new EditPage()
        //res.render('edit', { cfg: cfg, title: title, id: id, path: path, layout: layout, heading: title, text: text })
        page1.render(res)
    } catch(err) {
        const id = 0;
        const path = "";
        const layout = "";
        const title1 = "Neue Seite";
        const title = "";
        const text = "";
        const page = new FormPage() // TODO prüfen
        //res.render('form', { cfg: cfg, title1: title1, id: id, path: path, layout: layout, title: title, text: text })
        //next(err);
        page.render(res)
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
    /*
    req.body.id);
    req.body.heading)
    req.body.layout)
    req.body.text)
    req.file
    req.files
    // req.body will hold the text fields, if there were any
    */
    const images = [];
    if(Array.isArray(req.files)) {
        // TODO verify content
        for(const file of req.files) {
            try {
                /*await sharp(file.path).resize().jpeg({ quality: 50 
                        }).toFile("public/images/" + file.originalname);
                unlinkSync(file.path);
                images.push({url: file.originalname, alt: ""})*/
                // image compression is now client-seitig
                // generate a hash for filename
                // generate a unique filename
                // date based
                let currentDate = new Date(); let timestamp = currentDate. getTime();
                const filename = timestamp + ".jpg"
                await copyFile(file.path, "public/images/" + filename);
                images.push({url:  filename, alt: ""})
            } catch(error) {
                //console.log(error) // do not create black holes, it's hard to get out of them
                next(error);
            }
        }
    } else {
        try {
            let file = req.file 
            const filename = file.originalname + ".jpg"
            await copyFile(file.path, "public/images/" + filename);
            images.push({url:  filename, alt: ""})
        } catch(error) {
            //console.log(error)
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

    //console.log("page: " + JSON.stringify(page))

    try {
    await save(page)
    await setAppGetPages(); 
    console.log("page saved")
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
    console.log("save settings action")
    const settings = {
        style: request.body.style,
    };
    await saveSettings(settings) //ok    
    response.redirect("/");
}
