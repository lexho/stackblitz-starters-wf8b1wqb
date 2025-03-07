import { deletePage, getPageById, saveSettings, saveSetup } from '../models/model_async.js';
//import { removeRoute1 } from './webserver.js';
import { Index } from '../views/page.js';
import { MixedBlocks } from '../views/page.js'

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

        // using path instead of id
        path = page1.path 
    } catch(error) {
        console.log("page not found")
        next()
    }
    try {
        const layout = page1.layout;

        //(websitetitle, routes, style)
        
        // View with content
        if(layout == "blocks") {
            const title = page1.title; 
            const blocks = page1.blocks; 
            //console.log("blocks:",JSON.stringify(blocks))
            const page = new MixedBlocks(path, title, blocks)
            page.render(res)
        } else {
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

/** Duplikate vermeiden
* wenn neue seite == bestehender eintrag 
* @param content webpage content
* @param path path to query */
export function uniquePath(content, path) {
    let route = path
    while(contains(content, route)) {
        console.log("routing table already contains route: " + route)
        //removeRoute(app, route);
        route += 1
        console.log("+1")
    }
    return route;
}

/** setup website
 *  @param {Object} req - request with a websitetitle and an image 
*/
export async function setupAction(req, res, next) {
    console.log("setup action")
    let websitetitle = req.body.websitetitle
    let file = req.file
    try {
        await saveSetup(websitetitle, file) // errors --> pass errors to error handler via next
        res.redirect("/"); // to "home" page
    } catch(error) {
        // file error, website title error,...
        next(error); // pass errors to error handler via next
    }
}

/** saves the settings */
export async function saveSettingsAction(request, response) {
    return saveSettingsAction1(request, response, saveSettings);
}

export async function saveSettingsAction1(request, response, saveSettings) { // parameterized function for test
    console.log("save settings action")
    const settings = {
        style: request.body.style,
    };
    await saveSettings(settings) //ok    
    response.redirect("/");
}