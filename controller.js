import formidable, { errors as formidableErrors } from 'formidable';
import { replaceUmlaute } from './utility.js';
import { save, saveSettings } from './model_async.js';
import { getContent } from './model_async.js';
import { readFile, rename, copyFile, constants } from 'fs';

/** set parameter to render page
 * @param {Object} req - request, which contains page and config data
 *  @param {Object} res - rendered response of the webserver
 */
export async function pageAction(req, res) {
    const page = req.page
    const content = await getContent()
    content.pages[page.id-1]
    const cfg = req.cfg

    const id = page.id;
    const layout = page.layout;
    const title = page.title;
    const text = page.text;
    const images = page.images;
    
    // View with content
    if(layout == "text-with-title")
        res.render('text-with-title', { cfg: cfg, title: title, id: id, text: text })
    else if(layout == "gallery")
        res.render('gallery', { cfg: cfg, title: title, id: id, images: images })
    else if(layout == "text-with-gallery")
        res.render('text-with-gallery', { cfg: cfg, title: title, id: id, text: text, images: images})
    
    else
        res.render('index', { cfg: cfg, title: title, id: id, text: text})
}

/** saves page to file 
 * @param {Object} request contains the page
 * @param {Object} response redirects to home
*/
export async function saveAction(request, response) {
    const form = formidable( { allowEmptyFiles : true, minFileSize: 0 });
    let fields;
    let files;
    try {
        [fields, files] = await form.parse(request);
    } catch (err) {
        // example to check for a very specific error
        if (err.code === formidableErrors.maxFieldsExceeded) {

        }
        console.error(err);
    }
    console.log("fields: ")
    console.log(JSON.stringify({ fields, files }, null, 2))
    if(fields.layout[0] == "text-with-title") {
        // text-with-title layout
        const page = {
            id: 0,
            layout: fields.layout[0],
            title: fields.heading[0],
            text: fields.text[0],
            path: "/" + replaceUmlaute(fields.heading[0].toLowerCase().replaceAll(" ", ""))
        };
        if(page.id == 0) console.log("insert page: ")
        else console.log("updated page: ")
        console.log(page)
        console.log();
        await save(page)
    }
    if(fields.layout[0] == "gallery") {
        // gallery
        const images = []
        // save file on disk
        for(const file of files.multipleFiles) {
            rename(file.filepath, `public/images/upload/${file.originalFilename}`, () => {
                copyFile( `public/images/upload/${file.originalFilename}`, `public/images/${file.originalFilename}`, 
                    (err) => {
                        if (err) {
                            console.log("Error Found:", err);
                        }
                })
            });
            const image =  { "url": file.originalFilename, "alt": "" }
            images.push(image)
        }

        const id = 0
        const layout = fields.layout[0]
        const heading = fields.heading[0]
        const text = fields.text[0]
        const path = replaceUmlaute(heading.toLowerCase().replaceAll(" ", ""))
        //request.body.images
        const page = {
            id: id,
            layout: layout,
            title: heading,
            text: text,
            path: "/" + path,
            images: images
        };
        console.log(page)
        if(page.id == 0) console.log("insert page: ")
            else console.log("updated page: ")
        console.log(page)
        console.log();
        await save(page)
    }
    response.redirect("/");
}

/** generates new page or edit */
export async function formAction(request, response) {
    let page = { id: '', title: '', text: '' }
    const cfg = request.cfg
    if(request.params.id) { // edit
        let content1 = getContent();
        page = content1.pages[parseInt(request.params.id, 10)-1]
    
        const id = page.id;
        const path = page.path;
        const layout = page.layout;
        const title = page.title;
        const text = page.text;
        response.render('edit', { cfg: cfg, id: id, path: path, layout: layout, title: title, text: text })
    } else { // new
        const id = 0;
        const path = "";
        const layout = "";
        const title = "";
        const text = "";
        response.render('form', { cfg: cfg, title1: "Neue Seite", id: id, path: path, layout: layout, title: title, text: text })
    }
}

/** saves the settings */
export async function saveSettingsAction(request, response) {
    const settings = {
        style: request.body.style,
    };
    await saveSettings(settings)
    response.redirect("/");
}
