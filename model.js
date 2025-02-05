import { readFileSync } from 'fs';

export function getConfig() {
    try {
        return readFileSync('./config/config.json', 'utf-8')
    } catch(err){
        console.log(err)
    }
}

export function getContent() {
    try {
        return readFileSync('./config/content.json', 'utf-8')
    } catch(err){
        console.log(err)
    } 
}

export function getNotes() {
    try {
        return readFileSync('./config/editorsnotes.json', 'utf-8')
    } catch(err){
        console.log(err)
    }
}