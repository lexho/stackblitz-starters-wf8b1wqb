import { readFile } from 'node:fs/promises';
import { writeFile, appendFile, promises } from 'fs';
import { storeContent, storeNotes, getContent as getContentStorage, getNotes as getNotesStorage, writeToFile } from './storage_ram.js';

let filename = "config/content.json"
export function setFilename(name) {
    filename = name
}

export async function getConfig() {
    try {
        const data = readFile('./config/config.json', 'utf-8')
        return Promise.resolve(data)
    } catch(err){
        console.log(err)
    }
}

async function getContentFromFile() {
    try {
        const data = readFile('./config/content.json', 'utf-8')
        return Promise.resolve(data)
    } catch(err){
        console.log(err)
    } 
}

async function store() {
    const data = await getContentFromFile();
    storeContent(JSON.parse(data))
}

let firstTime = true
/** load content, the first time from file then from RAM */
export async function getContent() {
    if(firstTime) {
        const data = await getContentFromFile();
        // verify content
        let content = JSON.parse(data)
        for(const page of content.pages) {
            if(typeof page.path === "undefined") { throw new Error('content from file has errors.'); }
        }
        storeContent(JSON.parse(data))
        firstTime = false;
    }
    return getContentStorage()
}

async function getNotesFromFile() {
    try {
        const data = readFile('./config/editorsnotes.json', 'utf-8')
        return Promise.resolve(data)
    } catch(err){
        console.log(err)
    }
}

let firstTime1 = true
/** load notes, the first time from file then from RAM */
export async function getNotes() {
    if(firstTime1) { 
        const data = await getNotesFromFile();
        storeNotes(JSON.parse(data))
        firstTime1 = false; 
    }
    return getNotesStorage()
}

async function insert(page) {
    return new Promise(async (resolve, reject) => {
        page.id = await getNextId();
        const path = page.path;
        const id = page.id
        const layout = page.layout
        const title = page.title
        const text = page.text
        const images = page.images;
        let data = {}
        if(layout == "text-with-title") {
            data = { "id": id,"layout": layout,"title": title,"path": path,"text": text }
        }
        if(layout == "gallery") {
            data = {"id": id,"layout": layout,"title": title,"path": path, "images": images}
        }
            //let content = [];
            try {
                //content = await getContent(); // schon da sein?
                let content = await getContent()
                content.pages.push(data) // store in RAM
                storeContent(content)
                writeToFile()
                resolve();
            } catch(err) {
                console.log(err)
                content = {pages: []}
                reject();
            }
        }
    )
}

async function update(page) {
    let content
    const id = parseInt(page.id, 10);
    const index = id - 1;
    //let content = [];
    try {
        content = await getContent(); // schon da sein?
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    content.pages[index].title = page.title;
    content.pages[index].text = page.text;
    content.pages[index].id = id;
    storeContent(content)
    writeToFile()
    return Promise.resolve();
}

export async function saveSettings(settings) {
    let content = [];
    try {
        content = await getContent();
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    let style
    for(let style1 of settings.style) {
        if(style1.checked == 'checked') {
            style = style1.id
        }
    }
    content.style = style;
    storeContent(content)
    const json = JSON.stringify(content)
    writeToFile()
}

export async function save(page) {
    if(page.id == 0) console.log("insert page: ")
    else console.log("updated page: ")
    if(page.id === 0) {
        await insert(page)
    } else {
        await update(page)
    }
    return Promise.resolve();
}

async function getNextId() {
    let id = 0;
    let content = ""
     try {
        content = await getContent();
        } catch(err) {
            console.log(err)
            content = {pages: []}
        }
        id = content.pages[content.pages.length-1].id + 1
    return new Promise((resolve, reject) => {
        resolve(id);
    })
}

// do not use this, it doesn't work
async function appendToFile(data) {
    const data1 = "," + data + "]}"
    const stat = await promises.stat(filename)
    const fileSize = stat.size

    await promises.truncate(filename, fileSize - 2)
    appendFile(filename, data1, () => {})
}