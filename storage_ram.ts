import { Content } from './content.js';
import { Notes } from './notes.js';
import { rename, unlink, writeFile, access, constants } from 'node:fs/promises';

let content: Content
let notes: Notes // readonly

/** store content in RAM */
export function storeContent(c : Content) { //sync
    // prüüüüüüüüüüüüüfen
    if( (c instanceof Content) ) { // unnötig? prüfen ob man's weglassen kann
        content = c
    } else {
        console.error("invalid")
    }
}

/** load content from RAM */
export function getContent() { //sync
    return content
}

export function getPageById(id: number) {
    for(const page of content.pages) {
        if(page.id == id) return page
    }
}
export function getPageByPath(path: string) {
    console.log("getPageByPath")
    try {
    for(const page of content.pages) {
        //console.log(page.path + " ==? "+ path) //  + "/" + path
        if(page.path == path) {  /*console.log("match! get " + path);*/ return page  }
    }
    } catch(error) {
        console.log(error)
    }
}

export function deletePageById(id: number) {
    console.log("delete page by id " + id)
    for(let index = 0; index < content.pages.length; index++) {
        const page = content.pages[index]
        if(page !== undefined) {
            if(page.id == id) content.pages.splice(index, 1)
        } else {
            console.error("page delete undefined")
        }
    }
}

export function deletePageByPath(path: string) {
    console.log("delete page by id " + path)
    try {
    for(let index = 0; index < content.pages.length; index++) {
        const page = content.pages[index]
        if(page !== undefined) {
            if(page.path == "/"+path) {
                const before = JSON.stringify(content.pages)
                content.pages.splice(index, 1); /*console.log("match! delete " + path); */
                const after = JSON.stringify(content.pages)
                if(before == after) { console.error("something went wrong!")}
            }
        } else {
            console.error("page delete undefined")
        }
    }
    } catch(error) {
        console.log(error)
    }
}


/** store Notes in RAM */
export function storeNotes(n: Notes) { //sync
    // TODO prüüüüüüüüüüüüüfen
    notes = n // should be object already
    //console.log("store notes " +  JSON.stringify(notes)) //ok
}

/** load Notes from RAM */ 
export function getNotes() { //sync
    return notes
}



let filename = "config/content.json"
let filenameLock = "config/content.json.lock"

export function setFilename(name: string) {
    filename = name
    filenameLock = filename + ".lock";
}

/** write everything to file */
// export async function writeToFile(req: Request, res: Response, next: NextFunction) { //async
// pass errors to model
export async function writeToFile() {
    storeContent(content); // sync
    const json = JSON.stringify(content);
    console.log("write content to file");
    //try {
    let exists = false
    try {
        await access('config/content.json', constants.R_OK | constants.W_OK);
        exists = true
    } catch(err) {
        console.error('cannot access config/content.json');
    }
    if(exists) await rename(filename, filenameLock); // lock file // async
    await writeFile(filename, json); // write // async
    if(exists) await unlink(filenameLock); // remove lock file //
    console.log("written to file");
}