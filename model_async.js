import { readFile } from 'node:fs/promises';
import { writeFile, appendFile, promises } from 'fs';

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

let content
async function store() {
    const data = await getContentFromFile();
    content = JSON.parse(data)
}

let firstTime = true
/** load content, the first time from file then from RAM */
export async function getContent() {
    if(firstTime) { await store(); firstTime = false; return content; }
    return content;
}

async function getNotesFromFile() {
    try {
        const data = readFile('./config/editorsnotes.json', 'utf-8')
        return Promise.resolve(data)
    } catch(err){
        console.log(err)
    }
}

let notes
async function store1() {
    const data = await getNotesFromFile();
    notes = JSON.parse(data)
}

let firstTime1 = true
/** load notes, the first time from file then from RAM */
export async function getNotes() {
    if(firstTime1) { await store1(); firstTime1 = false; return notes; }
    return notes;
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
            let content = [];
            try {
                content = await getContent();
                content.pages.push(data)
                const json = JSON.stringify(content)
                writeFile(filename, json, err => {
                    if (err) {
                        console.error(err);
                        reject();
                    } else {
                    // file written successfully
                        resolve();
                    }
                });
            } catch(err) {
                console.log(err)
                content = {pages: []}
                reject();
            }
        }
    )
}

async function update(page) {
    const id = parseInt(page.id, 10);
    const index = id - 1;
    let content = [];
    try {
        content = await getContent();
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