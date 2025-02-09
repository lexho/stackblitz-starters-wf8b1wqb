import { getContent, getNotes, getConfig } from '../model_async.js';

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
});