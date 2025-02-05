import { readFile } from 'node:fs/promises';
import { writeFile, appendFile, promises } from 'fs';

export async function getConfig() {
    try {
        const data = readFile('./config/config.json', 'utf-8')
        return Promise.resolve(data)
    } catch(err){
        console.log(err)
    }
}

export async function getContent() {
    try {
        const data = readFile('./config/content.json', 'utf-8')
        return Promise.resolve(data)
    } catch(err){
        console.log(err)
    } 
}

export async function getNotes() {
    try {
        const data = readFile('./config/editorsnotes.json', 'utf-8')
        return Promise.resolve(data)
    } catch(err){
        console.log(err)
    }
}

async function insert(page) {
    page.id = await getNextId();
    //page.id = 0;
    const path = "/" + page.title.toLowerCase().replaceAll(" ", "");
    //const data = `{"id": ${page.id},"layout": "${page.layout}","title": "${page.title}","path": "${path}","text": "${page.text}"}`
    //{ websitetitle: websitetitle, title: title, routes: routes, id: page.id, images: images, todo: todo, cfg: cfg2})
    // gallery
    let images = page.images;
    let imagesString = "";
    for(let image of images) {
        imagesString += '{ "url":"' + image.url + '", "alt":""},';
    }
    imagesString = imagesString.substring(0, imagesString.length - 1);
    const data = `{"id": ${page.id},"layout": "${page.layout}","title": "${page.title}","path": "${path}", "images": [${imagesString}]}`
    appendToFile(data);
    return Promise.resolve();
}

async function update(page) {
    const id = parseInt(page.id, 10);
    const index = id - 1;
    //console.log("id: "+ id)
    let content = [];
    try {
        content = JSON.parse(await getContent());
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    /*console.log("updated page: " + JSON.stringify(page))
    console.log();
    console.log("id: "+ content.pages[index].id)
    console.log("title: "+ content.pages[index].title)
    console.log("text: "+ content.pages[index].text.substring(0,100))
    console.log();*/
    content.pages[index].title = page.title;
    content.pages[index].text = page.text;
    content.pages[index].id = id;
    /*console.log("updated page (integrated in content): ")
    console.log("id: "+ content.pages[index].id)
    console.log("title: "+ content.pages[index].title)
    console.log("text: "+ content.pages[index].text.substring(0,100) + "...")*/
    const json = JSON.stringify(content)
    //console.log();
    //console.log("modified content json-string: \n" + json + "\n")
    writeFile(filename, json, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
    });
}

export async function save(page) {
    if(page.id === '') {
        insert(page)
    } else {
        update(page)
    }
    return Promise.resolve();
}

async function getNextId() {
    let id = 0;
    let content = ""
     try {
        content = JSON.parse(await getContent());
        } catch(err) {
            console.log(err)
            content = {pages: []}
        }
        for(let page of content.pages) {
            console.log(page)
        }
        id = content.pages[content.pages.length-1].id + 1
    return new Promise((resolve, reject) => {
        resolve(id);
    })
}

const filename = "config/content.json"

async function appendToFile(data) {
    /*const id = 0
    const layout = "text-with-title"
    const title = "Titel"
    const path = "entry"
    const text = "hier kommt der text."

    const data = `{
                "id": ${id},
                "layout": "${layout}",
                "title": "${title}",
                "path": "${path}",
                "text": "${text}"
            }`
    */

    //const data = ",\n        " + "{\n            \"data\":\"some new data\"\n        }\n " + "    ]\n}\n"
    const data1 = "," + data + "]}"
    const stat = await promises.stat(filename)
    const fileSize = stat.size

    await promises.truncate(filename, fileSize - 2)
    appendFile(filename, data1, () => {})
}