import { copyFile, unlinkSync } from 'fs';
import sharp from 'sharp';
import { replaceUmlaute } from './utility.js';
import { getContent, save, deletePage, getPageByPath, saveSettings } from './model_async.js';
import { setAppGetPages } from './routing.js';
//import { removeRoute1 } from './webserver.js';

/** 
 * set parameter to render page
 * @param {Object} req - request which contains page and config data
 * @param {Object} res - rendered response of the webserver
 */
export async function pageAction(req, res) {
    if(req.page === undefined) { 
        res.send("Error 404. page not found.");
        return 
    }
    const page = req.page
    const cfg = req.cfg

    // usin path instead of id
    const path = page.path
    const layout = page.layout;
    const title = page.title;
    const text = page.text;
    const images = page.images;
    
    // View with content
    if(layout == "text-with-title")
        res.render('text-with-title', { cfg: cfg, title: title, path: path, text: text })
    else if(layout == "gallery")
        res.render('gallery', { cfg: cfg, title: title, path: path, images: images })
    else if(layout == "text-with-gallery")
        res.render('text-with-gallery', { cfg: cfg, title: title, path: path, text: text, images: images})
    
    else
        res.render('index', { cfg: cfg, title: title, path: path, text: text})
}

/** 
 * generates new page or edit
 * sends page data to a form to be editable
 * or sends a empty form for a new page
 */
export async function formAction(request, response) {
    return formAction1(request, response, getPageByPath)
}

export async function formAction1(request, response, getPageByPath) {
    let page = { id: '', title: '', text: '' }
    const cfg = request.cfg
    console.log("id: " + request.params.id)
    console.log("path: " + request.params.path)
    const path = request.params.path
    console.log("path: " + path)
    if(!(path === undefined)) { // edit
        console.log("edit")
        console.log("path: " + path)
        page = getPageByPath("/" + path) // TODO remove "/"
        //console.log("page: " + JSON.stringify(page))
        if(page === undefined) { response.end("Error. Page not found."); return; }
        const id = page.id

        //const path = page.path;
        const layout = page.layout;
        const title = page.title;
        const text = page.text;
        response.render('edit', { cfg: cfg, title: title, id: id, path: path, layout: layout, heading: title, text: text })
    } else { // new
        console.log("new")
        const id = 0;
        const path = "";
        const layout = "";
        const title = "";
        const text = "";
        response.render('form', { cfg: cfg, title1: "Neue Seite", id: id, path: path, layout: layout, title: title, text: text })
    }
}

/** 
 * deletes a page 
 * and reloads the page
 * @param {Object} req - request which contains page id
*/
export async function deleteAction(req, res) {
    console.log("delete")
    let page = getPageByPath("/" + req.params.id)
    let route = page.path
    //removeRoute1(route) // remove page route from express stack
    await deletePage(req.params.id)
    //res.end("page " + req.params.id + "deleted.")
    console.log("id: " + req.params.id)
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
 * @param {Object} request contains the page
 * @param {Object} response redirects to home
 * handle image upload
*/
export async function saveAction(request, response) {
    console.log("saveAction")
    // req.file
    // req.files
    // req.body will hold the text fields, if there were any

    const UPLOAD_PATH = '/uploads' //path.join(__dirname, '/uploads');
    const images = [];
    if(Array.isArray(request.files)) {
        // TODO verify content
        for(const file of request.files) {
            try {
                
                //const newFilePath = path.join(UPLOAD_PATH, uuid() + '_' +
                //file.originalname);
                // save newFilePath in your db as image path
                await sharp(file.path).resize().jpeg({ quality: 50 
                        }).toFile("public/images/" + file.originalname);
                unlinkSync(file.path);

                /*copyFile(file.path, "public/images/" + file.originalname, (err) => {
                    if (err) {
                        console.log("Error Found:", err);
                    }
                });*/
                images.push({url: file.originalname, alt: ""})
            } catch(error) {
                console.log(error) // do not create black holes, it's hard to get out of them
            }
        }
    } else {
        try {
            copyFile(request.file.path, "public/images/" + request.file.originalname, (err) => {
                if (err) {
                    console.log("Error Found:", err);
                }
            });
            images.push({url:  request.file.originalname, alt: ""})
        } catch(error) {
            console.log(error)
        }
    }

    let id
    if(request.body.id === undefined) id = 0;
    else id = request.body.id;
    const page = {
        layout: request.body.layout,
        title: request.body.heading,
        images: images,
        text: request.body.text,
        path: "/" + replaceUmlaute(request.body.heading.toLowerCase().replaceAll(" ", "")) // Duplikate möglich
    };

    page.id = id
    if(page.id == 0) {
        page.path = uniquePath(getContent(), page.path)
    }

    await save(page)
    await setAppGetPages(); 
    
    // routes neu bauen
    
    response.redirect(page.path);
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
