import { readFile, copyFile } from 'node:fs/promises';
import { storeContent, storeNotes, getContent as getContentStorage, getNotes as getNotesStorage, writeToFile,
    getPageById as getPageByIdStorage, deletePageByPath, getPageByPath as getPageByPathStorage } from './storage_ram.js';
import { Content } from './content.js';
import { setAppGetPages } from '../routing.js';
import { setWebsiteTitle } from '../config.js'

export async function getConfig() {
    const data1 = await readFile('./config/config.json', 'utf-8')
    const data = JSON.parse(data1)
    return data;
}

/** get content from RAM */
export function getContent() {
    return getContentStorage()
}

/** returns a page from storage by id */
export function getPageById(id) {
    return getPageByIdStorage(id);
}

/** load content from config/content.json file */
export async function loadContentFromFile() {
    let content
    try {
        const data1 = await readFile('./config/content.json', 'utf-8')
        const data = JSON.parse(data1)

        // verify content
        content = new Content(data)
    } catch(error) {
        // init a minimalistic default webpage
        console.log(error)
        console.log("init website with no pages")
        const obj = { websitetitle: "Alexander's Seite", page: "mypage", style: "stylecss", pages: []}
        content = new Content(obj)
    }
    storeContent(content) // content is ok, pages: []
}

/** get notes from RAM */
export function getNotes() {
    return getNotesStorage()
}

/** load notes from file */
export async function loadNotesFromFile() {
    const data = await readFile('./config/editorsnotes.json', 'utf-8')
    const data_parsed = JSON.parse(data)
    storeNotes(data_parsed)
    return data_parsed;
}

async function insert(page) {
    console.log("insert")

    page.id = getNextId(); // sync
    let content = getContent() // has to contain (empty) .pages array // sync
    content.pages.push(page) // store in RAM

    storeContent(content) // sync
    await writeToFile() // async
}

async function update(page) {
    console.log("update");
    let content
    const id = page.id;

    content = getContent();
    
    try {
        for(const page1 of content.pages) {
            if(id == page1.id) { // use unique id, hash, path
                page1.title = page.title;
                page1.text = page.text;
             }
        }
        const content1 = new Content(content)
        storeContent(content1)

    } catch(error) {
        //console.log(error)  // cannot store page
        throw new Error("cannot store page")
    }

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

    let style
    for(let style1 of settings.style) {
        if(style1.checked == 'checked') {
            style = style1.id
        }
    }
    content.style = style;
    let content1 = new Content(content)
    storeContent(content1)

    await writeToFile()
}

// pass errors to controller
export async function saveSetup(websitetitle, file) { // kein next oder error?
    if(!websitetitle) websitetitle = "Meine Seite" // default website title
    if(websitetitle.length > 0) { // there is a websitetitle and not an empty string or undefined
        let content = getContent()
        let content1 = new Content(content)
        content1.websitetitle = websitetitle
        storeContent(content1)
        setWebsiteTitle(websitetitle)
    } else {
        throw new Error("no website title defined")
    }
    // ich.jpg
    if(file) {  // there is a file
        await copyFile(file.path, "public/images/ich.jpg");
        await writeToFile()
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
    let content = getContent();
    const length = content.pages.length
    if(length > 0)
        id = content.pages[length-1].id + 1
    return id
}