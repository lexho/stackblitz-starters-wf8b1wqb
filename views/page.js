import  { getPageConfig, buildRoutes as buildRoutes1 } from '../config.js'
import { getContent } from '../models/model_async.js'

export class Page {
    /*        
        */
    constructor(path) {
        this.path = path
        const cfg = getPageConfig()
        this.websitetitle = cfg.websitetitle;
        this.routes = cfg.routes
        this.style = cfg.style;
        this.isLoggedIn = cfg.isLoggedIn
        this.build = cfg.build
        this.version = cfg.version
        this.preparePageConfigStatic()
    }

    path
    routes
    websitetitle
    style
    isLoggedIn
    build
    version
    cfg

    preparePageConfigStatic() { // private preparePageConfig()
        const routes = this.routes
        const websitetitle = this.websitetitle
        const build = this.build
        const style = this.style
        const isLoggedIn = this.isLoggedIn
        const version = this.version
        this.cfg = { routes: routes, websitetitle: websitetitle, build: build, version: version, style: style, isLoggedIn: isLoggedIn }
    }

    preparePageConfigDynamic() {
        const cfg = this.cfg
        cfg.isLoggedIn = this.isLoggedIn
        cfg.style = this.style
    }

    buildRoutes() {
        //console.log("build routes")
        let routes = buildRoutes1();
        /*let routes = [];
        let content = getContent()
        for(let page of content.pages) {
            routes.push({ path: page.path, label: page.title })
        }
        if(this.cfg.isLoggedIn) {
            routes.push({ path: '/page/new', label: "Neue Seite" })
            routes.push({ path: '/settings', label: "Settings" })
        }*/
        return routes
    }

    getStyle() {
        this.style = getContent().style //this.style
        return this.style
    }
    getRoutes() {
        this.routes = this.buildRoutes();
        return this.routes
    }
}

class Block {
    toHtml() {

    }
}

export class TextBlock extends Block {
    constructor(title, p) {
    super();
        this.title = title
        this.p = p
    }
    title
    p
    getTitle() {
        return this.title
    }
    getParagraph() {
        return this.p
    }
    toHtml() {
        const title = this.title
        const p = this.p
        const html = `<div class="col"><h3>${title}</h3><p>${p}</p></div>`
        return html;
    }
}

export class ImageBlock extends Block {
    constructor(url, alt) {
    super();
        this.url = url
        this.alt = alt
    }
    url
    alt
    toHtml() {
        const url = this.url
        const html = `<img class="image img-fluid mx-auto d-block" src="${url}" alt=""/>`
        return html
    }
}

export class GalleryBlock extends Block {
    constructor(images) {
    super();
        this.images = images
    }
    images
    toHtml() {
        let html = `<div id="photobox" class="col container-fluid">`
        for(const image of this.images) {
            const url = image.url
            const alt = image.alt
            html += `<img class="image img-fluid" src="${url}" alt="${alt}"/>`
        }
        html += "</div>"
        return html
    }
}

function generateText(word, length) {
    let text = word[0].toUpperCase()+word.substring(1, word.length)
    for(let i = 0; i < length; i++) {
        text += " "+word
    }
    text += "."
    return text;
}
export class MixedBlocks extends Page {
    constructor(path, title, blocks) {
        super(path);
        this.title = title
        /*this.blocks = []
        let text1 = generateText("text", 100)
        let text2 = generateText("text", 150)
        this.blocks.push(new TextBlock("heading1", text1), new TextBlock("heading2", text2))*/
        let blocks1 = []
        for(const block of blocks) {
            if(block.type == "text") {
                let b = new TextBlock(block.heading, block.paragraph)
                blocks1.push(b)
            } else if(block.type == "image") {
                let img = new ImageBlock(block.src, block.alt)
                blocks1.push(img)
            } else if(block.type == "gallery") {
                if(block.images.length == 1) {
                    let img = new ImageBlock(block.images[0].url, block.images[0].alt)
                    blocks1.push(img)
                } else {
                    let gall = new GalleryBlock(block.images)
                    blocks1.push(gall)
                }
            }
        }
        //let img = new ImageBlock("images/20230406_165714.jpg", "wir")
        //blocks1.push(img)
        this.blocks = blocks1;
    }

    //page
    title
    text
    blocks

    render(res) {
        super.getStyle()
        super.getRoutes()
        super.preparePageConfigDynamic()
        //const cfg = this.cfg
        const path = this.path // extract
        //const layout = page.layout; // extract
        const title = this.title; // extract
        const text = this.text; // extract
        //const images = page.images; // extract
        const blocks = this.blocks;

        //const cfg = { routes: routes, websitetitle: websitetitle, style: style, loggedIn: loggedIn }
        const cfg = this.cfg
        res.render('blocks', { cfg: cfg, title: title, path: path, blocks: blocks })
    }
}

// { title: "Website Setup", cfg: page_cfg}
export class SetupPage extends Page {
    constructor(path, title) {
        super(path);
        this.title = title
    }

    //page
    title

    render(res) {
        super.getStyle()
        super.getRoutes()
        super.preparePageConfigDynamic()
        const title = this.title; // extract
       

        const cfg = this.cfg
        
        res.render('setup', { cfg: cfg, title: title })
    }
}

export class Index extends Page {
    constructor(path, title, text) {
        super(path);
        this.title = title
        this.text = text
    }

    //page
    title
    text

    render(res) {
        super.getStyle()
        super.getRoutes()
        super.preparePageConfigDynamic()
        const path = this.path // extract
        //const layout = page.layout; // extract
        const title = this.title; // extract
        const text = this.text; // extract
        //const images = page.images; // extract


        const cfg = this.cfg
        res.render('index', { cfg: cfg, title: title, path: path, text: text })
    }
}

import { getBuild, getVersion } from '../config.js';

export class HomePage extends Page {
    constructor(todo, issues, build, version) {
        super("/");
        this.todo = todo;
        this.issues = issues;
        this.build = build;
        this.version = version;
    }

    //page
    title
    text
    todo
    issues
    build
    version

    render(res) {
        super.getStyle()
        super.preparePageConfigDynamic()
        super.getRoutes()

        const build = getBuild()
        const version = getVersion()
        const websitetitle = this.websitetitle
        const routes = this.routes
        const style = this.style
        const todo = this.todo
        const issues = this.issues
        const isLoggedIn = this.isLoggedIn

        const cfg = this.cfg
        cfg.todo = todo
        cfg.issues = issues
        cfg.routes = routes

        console.log("isLoggedIn:", isLoggedIn)
        //console.log("routes:", routes)

        res.render('home', { cfg: cfg, websitetitle: websitetitle, text: "" })
    }
}

export class SettingsPage extends Page {
    constructor(path, title) {
        super(path);
        this.title = title
        //this.checked = checked
    }

    //page
    title
    checked

    render(res) {
        super.getStyle()
        super.getRoutes()
        super.preparePageConfigDynamic()
        const path = this.path // extract
        const title = this.title; // extract
        const checked = this.style; // extract



        const cfg = this.cfg
        res.render('settings', { cfg: cfg, title: title, path: path, checked: checked })
    }
}

export class FormPage extends Page {
    constructor(title) {
        super(""); // TODO ned so super
        this.title = title
        //this.layout = layout
    }

    //page
    path
    title

    render(res) {
        super.getStyle()
        super.getRoutes()
        super.preparePageConfigDynamic()
        const path = this.path // extract
        const title = this.title; // extract

        // initial form content
        let block1 = { title: "Block1", p: `We have been waiting for something like this forever. 
Now it is here! It is called...
Blocks!`}
let blocks = []
blocks.push(block1)

        const cfg = this.cfg
        //res.render('formblocks', { cfg: cfg, title1: title1, id: id, path: path, layout: layout, title: title, text: text })
        //res.render('form', { cfg: cfg, title1: title1, path: path, checked: checked })
        res.render('formblocks', { cfg: cfg, title: title, path: path, blocks: blocks })
    }
}

export class EditPage extends Page {
    //constructor(path, title1, id, layout, title, text) {
    constructor(path, title, blocks) {
        super(path);
        this.title = title
        this.blocks = blocks
    }

    title
    blocks

    render(res) {
        console.log("EditPage")
        super.getStyle()
        super.getRoutes()
        super.preparePageConfigDynamic()
        const path = this.path // extract
        const title = this.title; // extract

        const blocks1 = []
        for(const block of this.blocks) {
            if(block.type == "text") {
                let b = new TextBlock(block.heading, block.paragraph)
                blocks1.push(b)
            } else if(block.type == "image") {
                let img = new ImageBlock(block.src, block.alt)
                blocks1.push(img)
            } else if(block.type == "gallery") {
                let gall = new GalleryBlock(block.images)
                blocks1.push(gall)
            }
        }

        const blocks = blocks1
        const cfg = this.cfg
        /*id
title    MultiBlocks1
heading1 Block1
text1    We have been waiting for som...*/
        //                                                                                 blocks
        //res.render('form', { cfg: cfg, title1: title1, id: id, path: path, layout: layout, title: title, text: text })
        //res.render('blocks', { cfg: cfg, title: title, path: path, blocks: blocks })
        //res.render('formblocks_edit', { cfg: cfg, title: title, path: path, title1: title1, heading1: heading1, text1: text1 })
        res.render('formblocks', { cfg: cfg, title: title, path: path, blocks: blocks })
        //res.send("hello")
        //res.render('form', { cfg: cfg, title1: title1, path: path, checked: checked })
    }
}

export class ErrorPage extends Page {
    // "Error 404" "Seite nicht gefunden." ""
    constructor(error, message, stack) {
        super("");
        this.title = error
        this.message = message
        this.stacktrace = stack
    }

    //page
    title
    message
    stacktrace

    render(res) {
        super.getStyle()
        super.getRoutes()
        super.preparePageConfigDynamic()

        const title = this.title; // extract
        const message = this.message; // extract
        const stacktrace = this.stacktrace


        const cfg = this.cfg
        res.render('error', {  title: title, message: message, stacktrace: stacktrace, cfg: cfg })
    }
}