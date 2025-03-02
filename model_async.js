import { readFile, copyFile } from 'node:fs/promises';
import { storeContent, storeNotes, getContent as getContentStorage, getNotes as getNotesStorage, writeToFile,
    getPageById as getPageByIdStorage, deletePageByPath, getPageByPath as getPageByPathStorage } from './storage_ram.js';
import { Content } from './content.js';
import { setAppGetPages } from './routing.js';
import { setWebsiteTitle } from './routing.js'

export async function getConfig() {
    const data1 = await readFile('./config/config.json', 'utf-8')
    const data = JSON.parse(data1)
    return data;
}

/** load content, the first time from file then from RAM */
export function getContent() {
    return getContentStorage()
}

export function getPageById(id) {
    return getPageByIdStorage(id);
}

export async function loadContentFromFile() {
    let content
    try {
    const data1 = await readFile('./config/content.json', 'utf-8')
    const data = JSON.parse(data1)

    // verify content
        content = new Content(data)
    } catch(error) {
        console.log(error)
        console.log("init website with no pages")
        const obj = { websitetitle: "Alexander's Seite", page: "mypage", style: "stylecss", pages: []}
        content = new Content(obj)
    }

    /*for(const page of content.pages) {
        if(typeof page.path === "undefined") { throw new Error('content from file has errors.'); }
    }*/
    storeContent(content) // content is ok, pages: []
}

/** load notes, the first time from file then from RAM */
export function getNotes() {
    return getNotesStorage()
}

export async function loadNotesFromFile() {
    const data = await readFile('./config/editorsnotes.json', 'utf-8')
    const data_parsed = JSON.parse(data)
    storeNotes(data_parsed)
    return data_parsed;
}

async function insert(page) {
    console.log("insert")

    page.id = getNextId(); // sync
    console.log("page.id: " + page.id)
    const path = page.path;
    const id = page.id
    const layout = page.layout
    const title = page.title
    const text = page.text
    const images = page.images;
    console.log(JSON.stringify(page))
    console.log(JSON.stringify(page))
    let data = {} // empty
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

    content = getContent(); // schon da sein?
    //content = {pages: []}

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
        //console.log(error)  // cannot store page
        throw new Error("cannot store page")
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

    content = getContent();
    //content = {pages: []}

    let style
    for(let style1 of settings.style) {
        if(style1.checked == 'checked') {
            style = style1.id
        }
    }
    content.style = style;
    //setStyle(style)
    let content1 = new Content(content)
    storeContent(content1)

    await writeToFile()
}

// pass errors to controller
export async function saveSetup(websitetitle, file) { // kein next oder error?
    if(!websitetitle) websitetitle = "Meine Seite" // default website title
    if(websitetitle.length > 0) { // there is a websitetitle and not an empty string or undefined
        let content = getContent() // pass errors to controller
        let content1 = new Content(content)
        content1.websitetitle = websitetitle
        storeContent(content1) // pass errors to controller
        setWebsiteTitle(websitetitle)
        //cfg.websitetitle = websitetitle
        setWebsiteTitle(websitetitle)
        //cfg.websitetitle = websitetitle
    } else {
        throw new Error("no website title defined")
    }
    // ich.jpg
    if(file) {  // there is a file
        await copyFile(file.path, "public/images/ich.jpg"); // pass errors to controller
        await writeToFile() // throws errors, pass errors to controller
    } else {
        // website without custom picture
        //throw new Error("no such file")
        let default_image = "public/images/ich_default.jpg"
        let trg = "public/images/ich.jpg"
        await copyFile(default_image, trg);
    }
}

function getNextId() {
    let id = 1;
    let content = ""

    content = getContent();
    //content = {pages: []}

    const length = content.pages.length
    if(length > 0)
        id = content.pages[length-1].id + 1
    return id
}