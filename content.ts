class Page {
    //id: number = 0;
    constructor(public id: number, public layout: string, public title: string, public path: string) {
        console.log("path: " + path)
        if(typeof path === "undefined") { throw new Error('page with broken path'); }
        else if(path.length == 0) { throw new Error('page with broken path'); }
    }
}

class Image1 {
    constructor(public url: string, public alt: string) {}
}

class Gallery extends Page {
    constructor(public id: number, public layout: string, public title: string, public path: string, public images: Image1[]) {
        super(id, layout, title, path);
    }
}

export class TextWithTitle extends Page {
    constructor(public id: number, public layout: string, public title: string, public path: string, public text: string) {
        super(id, layout, title, path);
    }
}

/**
 * Represents the whole content of the website.
 * @constructor
 */
export class Content {
   websitetitle: String = "";
   page: String = "mypage"; // TODO Deprecated, remove
   style: String = "";
   pages: Page[] = [];

   // { "id": id,"layout": layout,"title": title,"path": path,"text": text }
   constructor(obj: any) {
    //let obj = JSON.parse(json)

    // prüüüüüüüüüüüüüüüüüüüüüüüfen
    if(typeof obj.websitetitle === undefined) {  throw new Error("invalid content") }
    if(typeof obj.page === undefined) {  throw new Error("invalid content") }
    if(typeof obj.style === undefined) {  throw new Error("invalid content") }
    if(typeof obj.pages === undefined) {  throw new Error("invalid content") }

    this.websitetitle = obj.websitetitle
    this.page = obj.page
    this.style = obj.style

    let pages: Page[] = [];
    for(const p of obj.pages) {
        if(typeof obj.id === undefined) {  throw new Error("invalid content") }
        if(typeof obj.layout === undefined) {  throw new Error("invalid content") }
        if(typeof obj.title === undefined) {  throw new Error("invalid content") }
        if(typeof obj.path === undefined) {  throw new Error("invalid content") }

        let page
        if(p.layout == "text-with-title") {
            if(typeof obj.text === undefined) {  throw new Error("invalid content") }
            page = new TextWithTitle(p.id, p.layout, p.title, p.path, p.text)
        } else if(p.layout == "gallery") {
            if(typeof obj.images === undefined) {  throw new Error("invalid content") }
            page = new Gallery(p.id, p.layout, p.title, p.path, p.images)
        } else {
            page = new Page(p.id, p.layout, p.title, p.path) // default
        }
        pages.push(page)
    }
    this.pages = pages
   }

   [Symbol.iterator]() {
        let index = 0;
        const pages = this.pages; // assuming 'pages' is an array property of Content
        return {
            next: () => {
                if (index < pages.length) {
                    return { value: pages[index++], done: false };
                } else {
                    return { done: true };
                }
            }
        };
    }
}