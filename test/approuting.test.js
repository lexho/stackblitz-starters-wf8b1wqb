import { Content } from '../content.js'
import { Guestbook } from '../modules/guestbook.js'
import { setAppGetPages1 } from '../routing.js'
import { uniquePath } from '../controller.js'
import { getPageById } from '../model_async.js'

// für neue Seite
let obj_newpage = {"websitetitle":"Alexander's Seite","page":"mypage","style":"stylecss","pages":[
    {"id":5,"layout":"text-with-title","title":"text2","path":"/text21","text":"Text. Neuer."},
    {"id":6,"layout":"text-with-title","title":"text2","path":"/text21","text":"Text. Neuer."},
    {"id":6,"layout":"text-with-title","title":"text2","path":"/text21","text":"Text. Neuer."}]}
let obj = {"websitetitle":"Alexander's Seite","page":"mypage","style":"stylecss","pages":[
    {"id":5,"layout":"text-with-title","title":"text2","path":"/text2","text":"Text."},
    {"id":6,"layout":"text-with-title","title":"text3","path":"/text3","text":"Text."},
    {"id":7,"layout":"text-with-title","title":"text4","path":"/text4","text":"Text."}]}
let content = new Content(obj)
function getContent() {
 return content;
}
function storeContent(c) {
    content = c
}

const cb = (a,b) => {}
(route, cb) => {}
let routes = []
const app = { "get": (route, cb) => { routes.push(route) } }

function pageAction(req, res) {
    console.log("page action")
}

const cfg = {}
function buildRoutes() {}
function getNotes() {}
function formAction() {}
function deleteAction() {}
const guestbook = new Guestbook()
function saveAction() {}
function saveSettingsAction() {}
function setAppGet() {}
/*
export async function setAppGetPages1(router, content, cfg, buildRoutes, pageAction, setAppGet) {
    console.log("set app GET pages")
    //console.log(content.pages)
    //let content = await getContent() //TODO remove
    //try {
    /*console.log("content: " + JSON.stringify(content))
    console.log("content pages: " + JSON.stringify(content.pages))*/
    /*console.log("content page 1: " + JSON.stringify(content.pages[0]))
    console.log("content length: " + JSON.stringify(content.pages.length))

    for(let i = 0; i < content.pages.length; i++) {
        const page = content.pages[i]
        let route = page.path
    
        router.get(route, (req, res) => {
            req.page = getPageById(page.id) // callback function will be called when someone clicks an item from your menu
                                            // to get accurate page data you have to use 'getPageByID' and not 'page'
            req.cfg = cfg
            pageAction(req, res)
        });
    }
    buildRoutes();
    setAppGet()
}*/

describe('app routing and paths', () => {
    describe('setAppGetPages1()', () => {
        it('should generate routes', async () => {
            const content1 = getContent()
            console.log("CONTENT: " + JSON.stringify(content1))
            console.log("CONTENT: " + JSON.stringify(content1.pages))
               //setAppGetPages1(router1, content1, getPageById1, cfg11, pageAction1, buildRoutes1, setAppGet1)
            await setAppGetPages1(app, getContent(), getPageById, pageAction, buildRoutes, setAppGet)
            console.log("app routes: " + JSON.stringify(routes))
            let expected = ["/text2","/text3","/text4"]
            console.log(expected)
            console.log(routes)
            expect(routes).toStrictEqual(expected)

        });
    });
    describe('uniquePath', () => {
        it('should rename routes', async () => {
            //obj_newpage
            let pages = [{"id":5,"layout":"text-with-title","title":"text2","path":"/text21","text":"Text. Neuer."}]
            let content = {pages: pages}
            let page = {"id":5,"layout":"text-with-title","title":"text2","path":"/text21","text":"Text. Neuer."}
            page.path = uniquePath(content, page)

            expect(page.path).not.toEqual(pages[0].path)
        });
    });
})