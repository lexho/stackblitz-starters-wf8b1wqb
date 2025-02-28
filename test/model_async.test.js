import { readFile } from 'node:fs/promises';
import { getContent, getConfig, save, loadContentFromFile, loadNotesFromFile, getNotes } from '../model_async.js';
import { TextWithTitle } from '../content.js'
import { getContent as getContentStorage, storeContent, setFilename } from '../storage_ram.js'
import { Content } from '../content.js';

describe('model', () => {
    
    describe('getContent().websitetitle', () => {
        it('should return websitetitle', async () => {
            const filename = 'config/content.json'
            //setFilename(filename)
            await loadContentFromFile();
            let content = getContent()
            expect(content.websitetitle).toBe("Alexander's Seite");
        });
    });

    describe('getConfig()', () => {
        it('should exist', async () => {
            const config = await getConfig();
            expect(typeof(config)).toBe("object")
        });
    });

    describe('in editor\s notes: todolist', () => {
        it('should exist', async () => {
            await loadNotesFromFile()
            const todo = getNotes().todolist;
            expect(typeof(todo)).toBe("object");
        });
    });

    describe('in editor\s notes: issues', () => {
        it('should exist', async () => {
            await loadNotesFromFile()
            const issues = getNotes().issues;
            expect(typeof(issues)).toBe("object");
        });
    });

    describe('read/write', () => {
        it('should write', async () => {
            const filename = 'test/testfile.json'
            setFilename(filename)
            const page = {
                id: 0,
                layout: "text-with-title",
                path: "page.path",
                title: "page.title",
                text: "page.text"
            }
            await save(page)
            let data1;
            try {
                data1 = await readFile(filename, 'utf-8')
                //console.log(data1)
            } catch(err){
                console.log(err)
            }
            const data = data1
            expect(data).toContain("page.title");
            
        });
    })

    // neue seite erstellen
    describe('new page', () => {
        it('should write to storage', async () => {
            //writeToFile1 = false;
            let obj = {"websitetitle": "", "style": "stylecss", "page": "mypage", "pages": []}
            const content1 = new Content(obj)
            storeContent(content1) // init store with empty content
            const length0 = content1.pages.length
            const page1 = new TextWithTitle(0, "text-with-title", "text1", "/text1", "Text.") // new page
            await save(page1); // gets content from file
            const page2 = new TextWithTitle(0, "text-with-title", "text2", "/text2", "Text.") // new page
            await save(page2); // gets content from file
            const content = getContentStorage();
            console.log(content)
            expect(content.pages.length).toBe(length0+2)
            let index = 0;
            let pages = [page1, page2]
            for(const page of content.pages) {
                expect(page.id).toBe(pages[index].id)
                expect(page.layout).toBe(pages[index].layout)
                expect(page.title).toBe(pages[index].title)
                expect(page.path).toBe(pages[index].path)
                expect(page.text).toBe(pages[index].text)
                index++
            }
        })
    });
});