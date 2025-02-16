import { getContent } from '../model.js';

    let routes = []
        let content = JSON.parse(getContent());
        for(let page of content.pages) {
            routes.push({ path: page.path, label: page.title })
        }
    console.log(routes[0])
    console.log(routes)