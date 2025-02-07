import { getContent } from './model_async.js';

let content
try {
        //console.log(await getContent());
        content = JSON.parse(await getContent());
        console.log(content)
    } catch(err) {
        console.log(err)
        content = {pages: []}
    }