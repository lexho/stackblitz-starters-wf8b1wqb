import { Content } from './content.js';
import { Notes } from './notes.js';
import { rename, unlink, writeFile, access, constants } from 'node:fs/promises';

let content: Content
let notes: Notes // readonly

/** store content in RAM */
export function storeContent(c : Content) {
    if( (c instanceof Content) ) { // wird in Content-Klasse geprüft
        content = c
    } else {
        console.error("invalid")
    }
}

/** load content from RAM */
export function getContent() {
    return content
}

/** get page from content by id */
export function getPageById(id: number) {
    for(const page of content.pages) {
        if(page.id == id) return page
    }
}
/** get page from content by path */
export function getPageByPath(path: string) {
    try {
    for(const page of content.pages) {
        if(page.path == path) { return page }
    }
    } catch(error) {
        console.log(error)
    }
}

/** delete page from content by id */
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

/** delete page from content by path */
export function deletePageByPath(path: string) {
    console.log("delete page by path " + path)
    try {
    for(let index = 0; index < content.pages.length; index++) {
        const page = content.pages[index]
        if(page !== undefined) {
            if(page.path == "/"+path) {
                const before = JSON.stringify(content.pages)
                content.pages.splice(index, 1);
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
export function storeNotes(n: Notes) { // <-- check in Notes-Class
    notes = n // should be object already
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
    console.log("content written to file");
}