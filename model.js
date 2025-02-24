import { readFileSync } from 'fs';
import { storeContent, storeNotes, getContent as getContentStorage, getNotes as getNotesStorage } from './storage_ram.js';

export function loadConfig() {
    try {
        return readFileSync('./config/config.json', 'utf-8')
    } catch(err){
        console.log(err)
    }
}

/** load content from file and store it in RAM */
export function getContentFromFile() {
    try {
        const data = readFileSync('./config/content.json', 'utf-8')
        storeContent(JSON.parse(data))
        return data
    } catch(err){
        console.log(err)
    } 
}

/** load content from RAM */
export function getContent() {
    return getContentStorage();
}

export function getNotesFromFile() {
    try {
        const data = readFileSync('./config/editorsnotes.json', 'utf-8')
        storeNotes(JSON.parse(data))
        return data;
    } catch(err){
        console.log(err)
    }
}

export function getNotes() {
    return getNotesStorage()
}