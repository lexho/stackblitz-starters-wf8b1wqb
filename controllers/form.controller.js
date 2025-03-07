import { copyFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { replaceUmlaute } from '../public/js/utility.js';
import { getContent, save, deletePage, getPageById, getPageByPath, saveSettings, saveSetup } from '../models/model_async.js';
import { setAppGetPages } from '../routing.js';
//import { removeRoute1 } from './webserver.js';
import { EditPage, FormPage, MixedBlocks } from '../views/page.js'
import { uniquePath, contains }  from '../helpers/helper.js';

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
        // edit
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
        const title = page.title;
        const blocks = page.blocks;
        const page1 = new EditPage(path, title, blocks)
        //res.render('edit', { cfg: cfg, title: title, id: id, path: path, layout: layout, heading: title, text: text })
        page1.render(res)
    } catch(err) {
        const title = "Seitetitel";
        const page = new FormPage(title) // TODO prüfen
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



/** saves page to file 
 * @param {Object} req - request contains the page
 * @param {Object} res - response redirects to home
 * handle image upload
*/
export async function saveAction(req, res, next) {
    console.log("saveAction")
    console.log("upload_id:", req.body.upload_id)
    
    //req.body.layout
    //req.body.title
    //JSON.parse(req.body.blocks)
    /*
    req.body.id);
    req.body.heading)
    req.body.layout)
    req.body.text)
    req.file
    req.files
    // req.body will hold the text fields, if there were any
    */

    let id
    if(req.body.id === undefined) id = 0;
    else id = req.body.id;

    const layout = req.body.layout
    const title = req.body.title
    const blocks = JSON.parse(req.body.blocks) // ok

    /*const heading1 = req.body.heading1
    const text1 = req.body.text1
    const heading2 = req.body.heading2
    const text2 = req.body.text2

    const page = {
        id: id,
        layout: layout,
        title: heading1,
        heading1: heading1,
        text1: text1,
        heading2: heading2,
        text2: text2,
        path: "/" + replaceUmlaute(heading1.toLowerCase().replaceAll(" ", "")) // Duplikate möglich
    };*/

    //images: images, --> gallery block
    
    const page = {
        id: id,
        layout: layout,
        title: title,
        blocks: blocks, // ... / gallery / text / gallery
        path: "/" + replaceUmlaute(title.toLowerCase().replaceAll(" ", "")) // Duplikate möglich
    };

    // a schaß
    /*const page = {
        id: id,
        layout: layout,
        title: heading,
        images: images,
        text: text,
        path: "/" + replaceUmlaute(heading.toLowerCase().replaceAll(" ", "")) // Duplikate möglich
    };*/

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

/** saves page to file 
 * @param {Object} req - request contains the page
 * @param {Object} res - response redirects to home
 * handle image upload
*/
export async function saveImageFilesAction(req, res, next) {
    console.log("saveImageFilesAction")
    console.log("req.body.upload_id:",req.body.upload_id)
    console.log("req.body.gallery_id:",req.body.gallery_id)
    //console.log("req.files[0].name:",req.files[0].name)
    const upload_id = req.body.upload_id
    const gallery_id = req.body.gallery_id
    
    // req.file
    // req.files
    // req.body will hold the text fields, if there were any

    const images = [];
    if(Array.isArray(req.files)) {
        const folder_path = "public/images/" + upload_id + "_" + gallery_id
        await mkdir(folder_path)
        // TODO verify content
        for(const file of req.files) {
            try {
                // image compression is now client-seitig
                // generate a hash for filename
                // generate a unique filename
                // date based
                //let currentDate = new Date(); let timestamp = currentDate.getTime();
                //const filename = timestamp + ".jpg"
                const filename = file.originalname
                await copyFile(file.path, folder_path + "/" + filename);
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

    //console.log("images:", JSON.stringify(images))

    //link images with --> gallery block

    res.end("end")
}