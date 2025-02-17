import { writeFile } from 'fs';

let content
let notes // readonly
let filename = "config/content.json"

/** store content in RAM */
export function storeContent(c) {
    console.log("store content in RAM")
    content = c
}

/** load content from RAM */
export function getContent() {
    return content
}


/** store Notes in RAM */
export function storeNotes(c) {
    console.log("store notes in RAM")
    notes = c // should be object already
    //console.log("store notes " +  JSON.stringify(notes)) //ok
}

/** load Notes from RAM */
export function getNotes() {
    return notes
}

/** write everything to file */
export function writeToFile() {
    storeContent(content)
    
        const json = JSON.stringify(content)
        console.log("write content to file")
        writeFile(filename, json, err => {
            if (err) {
              console.error(err);
              //reject(err)
            } else {
              // file written successfully
              console.log("content written successfully")
              return
              //resolve()
            }
        });
}