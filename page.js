import  { getPageConfig } from './routing.js'
import { getContent } from './model_async.js'

export class Page {
    /*        
        */
    constructor(path) {
        this.path = path
        const cfg = getPageConfig()
        this.websitetitle = cfg.websitetitle;
        this.routes = cfg.routes
        this.style = cfg.style;
    }

    path
    routes
    websitetitle
    style

    buildRoutes() {
        //console.log("build routes")
        let routes = [];
        let content = getContent()
        for(let page of content.pages) {
            routes.push({ path: page.path, label: page.title })
        }
        routes.push({ path: '/page/new', label: "Neue Seite" })
        routes.push({ path: '/settings', label: "Settings" })
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

export class TextWithTitle extends Page {
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
        //const cfg = this.cfg
        const path = this.path // extract
        //const layout = page.layout; // extract
        const title = this.title; // extract
        const text = this.text; // extract
        //const images = page.images; // extract
        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style
        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('text-with-title', { cfg: cfg, title: title, path: path, text: text })
    }
}

export class TextWithGallery extends Page {
    constructor(path, title, text, images) {
        super(path);
        //this.page = page
        this.title = title
        this.text = text
        this.images = images
    }

    //page
    title
    images

    render(res) {
        super.getStyle()
        super.getRoutes()
        //const cfg = this.cfg
        const path = this.path // extract
        //const layout = page.layout; // extract
        const title = this.title; // extract
        const images = this.images; // extract
        const text = this.text;

        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style
        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('text-with-gallery', { cfg: cfg, title: title, path: path, text: text, images: images })
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
        const title = this.title; // extract
       
        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style
        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        
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
        const path = this.path // extract
        //const layout = page.layout; // extract
        const title = this.title; // extract
        const text = this.text; // extract
        //const images = page.images; // extract

        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style
        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('index', { cfg: cfg, title: title, path: path, text: text })
    }
}

export class HomePage extends Page {
    constructor(todo, issues) {
        super("/");
        this.todo = todo;
        this.issues = issues;
    }

    //page
    title
    text
    todo
    issues

    render(res) {
        super.getStyle()
        super.getRoutes()
        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style
        const todo = this.todo
        const issues = this.issues
        const cfg = { routes: routes, websitetitle: websitetitle, style: style, todo: todo, issues: issues }
        res.render('home', { cfg: cfg, websitetitle: websitetitle, text: "" })
    }
}

export class Gallery extends Page {
    constructor(path, title, images) {
        super(path);
        //this.page = page
        this.title = title
        this.images = images
    }

    //page
    title
    images

    render(res) {
        super.getStyle()
        super.getRoutes()
        //const cfg = this.cfg
        const path = this.path // extract
        //const layout = page.layout; // extract
        const title = this.title; // extract
        const images = this.images; // extract

        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style
        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('gallery', { cfg: cfg, title: title, path: path, images: images })
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
        const path = this.path // extract
        const title = this.title; // extract
        const checked = this.style; // extract

        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style

        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('settings', { cfg: cfg, title: title, path: path, checked: checked })
    }
}

export class FormPage extends Page {
    constructor(path, title1, id, layout, title, text) {
        super(path);
        this.title1 = title1
        this.id = id
        this.layout = layout
        this.title = title
        this.text = text
    }

    //page
    path
    title1
    id
    layout
    title
    text

    render(res) {
        super.getStyle()
        super.getRoutes()
        const path = this.path // extract
        const title = this.title; // extract
        const title1 = this.title1; // extract
        const id = this.id;
        const layout = this.layout
        const text = this.text; // extract

        const routes = super.getRoutes()
        const websitetitle = this.websitetitle
        const style = this.style

        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('form', { cfg: cfg, title1: title1, id: id, path: path, layout: layout, title: title, text: text })
        //res.render('form', { cfg: cfg, title1: title1, path: path, checked: checked })
    }
}

export class EditPage extends Page {
    constructor(path, title1, id, layout, title, text) {
        super(path);
        this.title1 = title1
        this.id = id
        this.layout = layout
        this.title = title
        this.text = text
    }

    //page
    path
    title1
    id
    layout
    title
    text

    render(res) {
        super.getStyle()
        super.getRoutes()
        const path = this.path // extract
        const title = this.title; // extract
        const title1 = this.title1; // extract
        const id = this.id;
        const layout = this.layout
        const text = this.text; // extract

        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style

        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('form', { cfg: cfg, title1: title1, id: id, path: path, layout: layout, title: title, text: text })
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

        const title = this.title; // extract
        const message = this.message; // extract
        const stacktrace = this.stacktrace

        const routes = this.routes
        const websitetitle = this.websitetitle
        const style = this.style
        const cfg = { routes: routes, websitetitle: websitetitle, style: style }
        res.render('error', {  title: title, message: message, stacktrace: stacktrace, cfg: cfg })
    }
}
