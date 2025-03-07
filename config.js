import { loadConfig }  from './models/model.js'
import { loadContentFromFile, getContent } from './models/model_async.js'


let websitetitle
let version
let build
let loadOnTheFly // deprecated
let enableModules
let style
let isLoggedIn = false

export async function loadConfig1() {
    try {
        const cfg1 = JSON.parse(loadConfig());
        websitetitle = cfg1.websitetitle
        version = cfg1.version
        build = cfg1.build
        loadOnTheFly = cfg1.loadOnTheFly// deprecated
        enableModules = cfg1.enableModules

        //await loadContentFromFile()
        const content = getContent()
        style = content.style
    } catch(err) {
        console.log(err)
    }
}

export function login() {
    console.log("login")
    isLoggedIn = true
}

export function logout() {
    console.log("logout")
    isLoggedIn = false
}

export function getBuild() {
    return build;
}

export function getVersion() {
    return version;
}

export function print() {
    console.log("websitetitle:", websitetitle)
    console.log("version:", version)
    console.log("build:", build)
    console.log("loadOnTheFly:", loadOnTheFly)
    console.log("enableModules:", enableModules)
    console.log("style:", style)
}

export function setWebsiteTitle(websitetitle) {
    websitetitle = websitetitle
}

export function modulesEnabled() {
    return enableModules
}

export function isDebug() {
    if(build == "debug") return true; 
    else return false;
}

/** build routes for the menu */
export function buildRoutes() {
    //console.log("build routes")
    let routes = [];
    let content = getContent()
    for(let page of content.pages) {
        routes.push({ path: page.path, label: page.title })
    }
    if(isLoggedIn) {
        routes.push({ path: '/page/new', label: "Neue Seite" })
        routes.push({ path: '/settings', label: "Settings" })
    }
    if(!isLoggedIn)
        routes.push({ path: "/login", label: "Login" })
    else routes.push({ path: "/logout", label: "Logout"})
    return routes
}

/** get config for the page */
export function getPageConfig() {
    const cfg_page = {}
    cfg_page.routes = buildRoutes()
    let content = getContent()
    cfg_page.websitetitle = content.websitetitle
    cfg_page.style = style
    cfg_page.isLoggedIn = isLoggedIn
    cfg_page.build = build
    cfg_page.version = version
    return cfg_page
}