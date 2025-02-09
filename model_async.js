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
    const path = page.path;
    const id = page.id
    const layout = page.layout
    const title = page.title
    const text = page.text
    const images = page.images;
    if(layout == "text-with-title") {
        const data = `{"id": ${id},"layout": "${layout}","title": "${title}","path": "${path}","text": "${text}"}`
        appendToFile(data);
    }
    // gallery
    if(layout == "gallery") {
        let imagesString1 = "";
        for(let image of images) {
            imagesString1 += '{ "url":"' + image.url + '", "alt":""},';
        }
        imagesString1 = imagesString1.substring(0, imagesString1.length - 1);
        const imagesString = imagesString1;
        const data = `{"id": ${id},"layout": "${layout}","title": "${title}","path": "${path}", "images": [${imagesString}]}`
        appendToFile(data);
    }    
    return Promise.resolve();
}

async function update(page) {
    const id = parseInt(page.id, 10);
    const index = id - 1;
    let content = [];
    try {
        content = JSON.parse(await getContent());
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    content.pages[index].title = page.title;
    content.pages[index].text = page.text;
    content.pages[index].id = id;
    const json = JSON.stringify(content)
    writeFile(filename, json, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
    });
}

export async function save(page) {
    if(page.id === 0) {
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
        id = content.pages[content.pages.length-1].id + 1
    return new Promise((resolve, reject) => {
        resolve(id);
    })
}

const filename = "config/content.json"

async function appendToFile(data) {
    const data1 = "," + data + "]}"
    const stat = await promises.stat(filename)
    const fileSize = stat.size

    await promises.truncate(filename, fileSize - 2)
    appendFile(filename, data1, () => {})
}