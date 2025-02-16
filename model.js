import { readFileSync } from 'fs';

export function getConfig() {
    try {
        return readFileSync('./config/config.json', 'utf-8')
    } catch(err){
        console.log(err)
    }
}

let content
/** load content from file and store it in RAM */
export function getContentFromFile() {
    try {
        const data = readFileSync('./config/content.json', 'utf-8')
        content = JSON.parse(data)
        return data
    } catch(err){
        console.log(err)
    } 
}

/** load content from RAM */
export function getContent() {
    //console.log("load content from RAM")
    return content;
}

let notes
export function getNotesFromFile() {
    try {
        const data = readFileSync('./config/editorsnotes.json', 'utf-8')
        notes = JSON.parse(data)
        return data;
    } catch(err){
        console.log(err)
    }
}

export function getNotes() {
    //console.log("load notes from RAM")
    return notes
}