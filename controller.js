import { replaceUmlaute } from './utility.js';
import { content, routes, cfg2, todo } from './webserver.js';
import { getContent, save } from './model_async.js';

export async function saveAction(request, response) {
    if(request.body.layout == "text-with-title") {
        // text-with-title layout
        const page = {
            id: parseInt(request.body.id),
            layout: request.body.layout,
            title: request.body.title,
            text: request.body.text,
            path: "/" + replaceUmlaute(request.body.title.toLowerCase().replaceAll(" ", ""))
        };
        if(page.id == 0) console.log("insert page: ")
        else console.log("updated page: ")
        console.log(page)
        console.log();
        await save(page)
    }
    if(request.body.layout == "gallery") {
        // gallery
        const id = parseInt(request.body.id)
        const layout = request.body.layout
        const title = request.body.title
        const text = request.body.text
        const path = replaceUmlaute(title.toLowerCase().replaceAll(" ", ""))
        const images = request.body.images
        const page = {
            id: id,
            layout: layout,
            title: title,
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

export async function formAction(request, response) {
    let page = { id: '', title: '', text: '' }
    if(request.params.id) { // edit
        let content1 = JSON.parse(await getContent());
        page = content1.pages[parseInt(request.params.id, 10)-1]
    
        const id = page.id;
        const path = page.path;
        const layout = page.layout;
        const title = page.title;
        const text = page.text;
        response.render('edit', { websitetitle: content.websitetitle, routes: routes, id: id, path: path, layout: layout, title: title, text: text, todo: todo, cfg: cfg2 })
    } else {
        const id = 0;
        const path = "";
        const layout = "";
        const title = "";
        const text = "";
        response.render('form', { websitetitle: content.websitetitle, title1: "Neue Seite", routes: routes, id: id, path: path, layout: layout, title: title, text: text, todo: todo, cfg: cfg2 })
    }
}
