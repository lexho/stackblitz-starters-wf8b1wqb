import { readFile } from 'node:fs/promises';
import { storeContent, storeNotes, getContent as getContentStorage, getNotes as getNotesStorage, writeToFile, 
    getPageById as getPageByIdStorage, deletePageByPath, getPageByPath as getPageByPathStorage } from './storage_ram.js';
import { Content } from './content.js';
import { setAppGetPages, setStyle } from './routing.js';

export async function getConfig() {
    try {
        const data = await readFile('./config/config.json', 'utf-8')
        JSON.parse(data)
        return data;
    } catch(err){
        console.log(err)
    }
}

/** load content, the first time from file then from RAM */
export function getContent() {
    return getContentStorage()
}

export function getPageById(id) {
    return getPageByIdStorage(id);
}

export async function loadContentFromFile() {
    let data
    try {
        data = await readFile('./config/content.json', 'utf-8')
    } catch(err){
        console.log(err)
    }

    // verify content
    let content
    try {
        content = new Content(JSON.parse(data))
    } catch(error) {
        console.log(error)
        const obj = { websitetitle: "Alexander's Seite", page: "mypage", style: "stylecss", pages: []}
        content = new Content(obj)
    }

    for(const page of content.pages) {
        if(typeof page.path === "undefined") { throw new Error('content from file has errors.'); }
    }
    storeContent(content) // content is ok, pages: []
}

/** load notes, the first time from file then from RAM */
export async function getNotes() {
    return getNotesStorage()
}

export async function loadNotesFromFile() {
    let data
    try {
        data = await readFile('./config/editorsnotes.json', 'utf-8')
    } catch(err){
        console.log(err)
    }
    const data_parsed = JSON.parse(data)
    storeNotes(data_parsed)
    return data_parsed;
}

async function insert(page) {
    console.log("insert")

    page.id = await getNextId(); // sync
    console.log("page.id: " + page.id)
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
    let content = getContent() // has to contain (empty) .pages array // sync
    content.pages.push(data) // store in RAM
    storeContent(content) // sync
    await writeToFile() // async
}

async function update(page) {
    console.log("update");
    let content
    const id = page.id;
    //let content = [];
    try {
        content = getContent(); // schon da sein?
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    //console.log("content");
    //console.log("content old: " + JSON.stringify(getContent()))
    try {
        for(const page1 of content.pages) {
            if(id == page1.id) { // use unique id, hash, path
                page1.title = page.title;
                page1.text = page.text;
             }
        }
    const content1 = new Content(content)
    storeContent(content1)
    //console.log("content new: " + JSON.stringify(getContent()))
    } catch(error) {
        console.log(error)
    }
    console.log("content stored");
    await writeToFile() // async
}

export async function save(page) {
    if(page.id == 0) {
        return await insert(page)
    } else {
        return await update(page)
    }
}

/**
 * Returns a page described by a pth.
 * @param {string} path - The path of the page.
 */
export function getPageByPath(path) {
    return getPageByPathStorage(path);
}

export async function deletePage(id) {
    deletePageByPath(id)
    await setAppGetPages()
}

export async function saveSettings(settings) {
    let content = [];
    try {
        content = getContent();
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
    setStyle(style)
    let content1 = new Content(content)
    storeContent(content1)

    await writeToFile()
}

async function getNextId() {
    let id = 1;
    let content = ""
     try {
        content = getContent();
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }
    if(content.pages.length > 0)
        id = content.pages[content.pages.length-1].id + 1
    return id
}