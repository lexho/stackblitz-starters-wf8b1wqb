import { replaceUmlaute } from './utility.js';
import { save } from './save.js';

const request1 = {
    body: {
        id: 0,
        layout: "text-with-title",
        title: "Testseite",
        text: "Das ist ein Testtext"
    }
}

const request2 = {
    body: {
        id: 1,
        layout: "text-with-title",
        title: "Testseite",
        text: "Das ist ein Testtext"
    }
}

saveAction(request1, {});
saveAction(request2, {});

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
}