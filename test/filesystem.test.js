import fs from 'node:fs';
import { getConfig } from '../model_async.js';

describe('filesystem', () => {
    //let calc;
    /*beforeEach(() => {
        calc = new Calc();
    });*/

    // config file
    describe('config/config.json', () => {
        it('should be readable', () => {
            // Test the read permission
            fs.access('config/config.json', fs.constants.R_OK, (err) => {
                //console.log('\n> Checking Permission for reading the file');
                if (err)
                console.error('No Read access');
                //else
                //console.log('File can be read');
                expect(err).toBeFalsy()
            });
        });
        it('should exist and should be valid', async () => {
            let cfg1 = ""
            try {
                cfg1 = JSON.parse(await getConfig()); // load config from config.json
                console.log(cfg1)
            } catch(err) {
                console.log(err)
            }
            const cfg = cfg1
            expect(cfg.build).toBeDefined();
            expect(cfg.websitetitle).toBeDefined();
        });
    });

    // content file
    describe('config/content.json', () => {
        it('should exist and should be valid', async () => {

        });
        it('should be readable', () => {
            fs.access('config/content.json', fs.constants.R_OK, (err) => {
                if (err) console.error('No Read access');
                expect(err).toBeFalsy()
            });
        });
    });

    // folder structure
    describe('public', () => {
        it('should exist: css', async () => {
            const folderName = './public/css';
            expect(fs.existsSync(folderName)).toBeTruthy()
        });
        it('should exist: images', async () => {
            const folderName = './public/images';
            expect(fs.existsSync(folderName)).toBeTruthy()
        });
        it('should exist: js', async () => {
            const folderName = './public/js';
            expect(fs.existsSync(folderName)).toBeTruthy()
        });
    });

    /*describe('config/content.json', () => {
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
    });*/
});