import { readFile } from 'node:fs/promises';
import { getContent, getNotes, getConfig, save, setFilename } from '../model_async.js';

describe('model', () => {
    
    describe('getContent().websitetitle', () => {
        it('should return websitetitle', async () => {
            const content = JSON.parse(await getContent());
            expect(content.websitetitle).toBe("Alexander's Seite");
        });
    });

    describe('getConfig().loadOnTheFly', () => {
        it('should exist', async () => {
            const config = JSON.parse(await getConfig());
            expect(typeof(config)).toBe("object")
        });
    });

    describe('in editor\s notes: todolist', () => {
        it('should exist', async () => {
            const todo = JSON.parse(await getNotes()).todolist;
            expect(typeof(todo)).toBe("object");
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
            save(page)
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
});