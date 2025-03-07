/*import { pageAction, saveSettingsAction1 } from '../controllers/page.controller.js'
import { formAction1  } from '../controllers/form.controller.js'*/
import request from 'request';
/*import { start, stop } from '../webserver.js'
import { getPageConfig, login } from '../config.js'*/

function request1(url, expected) {
    return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
            expect(response).toBeDefined()
            console.log("expected:",expected)
            console.log("received:",body)
            expect(body).toContain(`<input id="heading1" type="text" name="heading" class="form-control" aria-describedby="heading" value="${expected.heading}" />`)
            expect(body).toContain(`<textarea name="text" class="form-control" aria-label="text" >${expected.text}</textarea>`)
            resolve()
        })
    })
}

function request2(url, expected) {
    return new Promise((resolve, reject) => {
        request(url, (err, response, body) => {
            expect(response).toBeDefined()
            expect(body).not.toContain(`<input type="text" name="heading" class="form-control" aria-describedby="heading" value="${expected.heading}" />`)
            expect(body).not.toContain(`<textarea name="text" class="form-control" aria-label="text" >${expected.text}</textarea>`)
            resolve()
        })
    })
}




describe('controller', () => {
    /*beforeAll(() => {
        start();
        login();
    });
    afterAll(() => {
        stop();
    })*/
    describe('url request', () => {
        // TODO load content.json mit entsprechenden pages
        it('should render edit \'text1\'', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 4000)
            const url = 'http://localhost:8080/page/new/text1' // edit
            const expected = { heading: 'text1', text: "Text." } // form
            await request1(url, expected);
        })
        it('should render edit \'text2\'', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 4000)
            const url = 'http://localhost:8080/page/new/text2'
            const expected = { heading: 'text2', text: "Text." }
            await request1(url, expected);
        })
        it('should not render edit \'text3\'', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 4000)
            const url = 'http://localhost:8080/page/new/text3'
            const expected = { heading: 'text3', text: "Text." }
            await request2(url, expected);
        })
    })
        /*it('should render page 1', async () => {
            let req = {}
            let page = {}
            page.path = "/"
            page.layout = "text-with-title";
            page.title = "testtitle";
            page.text = "testtext";
            page.images = [];
            req.page = page
            //render('index', { cfg: cfg, title: title, id: id, text: text})
            let res = { render: (file, params) => {
                console.log("fake rendered: " + JSON.stringify(params))
                console.log("page.title", page.title)
                console.log("page.text", page.text)
                expect(params.title).toBe(page.title)
                expect(params.text).toBe(page.text)
            }}
            await pageAction(req, res)
        });
        it('should render page 2', async () => {
            let req = {}
            let page = {}
            page.path = "testtitle11"
            page.title = "testtitle1";
            page.text = "testtext1";
            req.page = page
            //render('index', { cfg: cfg, title: title, id: id, text: text})
            let res = { render: (file, params) => {
                console.log("fake rendered: " + JSON.stringify(params))
                expect(params.path).toBe(page.path) // "/testtitle11" Received: "testtitle11, "/" fehlt
                expect(params.title).toBe(page.title)
                expect(params.text).toBe(page.text)
            }}
            await pageAction(req, res)
        });
        it('should render page 3', async () => {
            let req = {}
            let page = {}
            page.path = "/text1"
            page.title = "text1";
            page.text = "Hier kommt der Text rein.";
            req.page = page
            //render('index', { cfg: cfg, title: title, id: id, text: text})
            let res = { render: (file, params) => {
                console.log("fake rendered: " + JSON.stringify(params))
                expect(params.path).toBe(page.path)
                expect(params.title).toBe(page.title)
                expect(params.text).toBe(page.text)
            }}
            await pageAction(req, res)
        });
        it('should render page 4 page not path', async () => {
            let req = {}
            let page = {}
            page.id = 1
            page.path = "/text1"
            page.title = "text1";
            page.text = "Hier kommt der Text rein.";
            req.page = page
            //render('index', { cfg: cfg, title: title, id: id, text: text})
            let res = { render: (file, params) => {
                console.log("fake rendered: " + JSON.stringify(params))
                expect(params.path).toBe(page.path)
                expect(params.title).toBe(page.title)
                expect(params.text).toBe(page.text)
                expect(params.id).not.toBe(page.path)
                expect(params.path).not.toBe(page.id)
            }}
            await pageAction(req, res)
        });
        it('should render page cfg', async () => {
            let req = {}
            let page = {}
            page.id = 6
            page.path = "/testtitle11"
            page.title = "testtitle1";
            page.text = "testtext1";
            req.page = page
            req.cfg = getPageConfig() // context
            //render('index', { cfg: cfg, title: title, id: id, text: text})
            /*    cfg_page.routes = cfg.routes
                cfg_page.websitetitle = cfg.websitetitle
                cfg_page.style = cfg.style*/
            /*let res = { render: (file, params) => {
                console.log("fake rendered: " + JSON.stringify(params))
                expect(params.cfg.routes).toBeDefined()
                expect(params.cfg.websitetitle).toBeDefined()
                expect(params.cfg.style).toBeDefined()
                expect(params.path).toBe(page.path)
                expect(params.title).toBe(page.title)
                expect(params.text).toBe(page.text)
            }}
            await pageAction(req, res)
        });
        it('page config schnelltest', () => {
            let page_cfg = getPageConfig() // context
            //console.log("page_cfg: " + JSON.stringify(page_cfg))
            expect(page_cfg.routes).toBeDefined()
            expect(page_cfg.websitetitle).toBeDefined()
            expect(page_cfg.style).toBeDefined()
        })
    });
    describe('formAction', () => {
        it('should render form', async () => {
            let req = {}
            req.cfg = {}
            req.params = {}
            req.params.path = '/path'
            const page = {}    
                page.id = 5;
                page.path = "/path";
                page.layout = "text-with-title";
                page.title = "testtitle";
                page.text = "testtext";
            //render('index', { cfg: cfg, title: title, id: id, text: text})
            let res = { render: (file, params) => {
                console.log("fake rendered: " + JSON.stringify(params))
                expect(params.path).toBe(page.path)
                expect(params.layout).toBe(page.layout)
            }}
            await formAction1(req, res, () => {     
                
            return page; })
        });
    });*/
    /*describe('saveAction', () => {
        it('should not block', async () => {
            let response
            response = { redirect: (data) => {}}
            let request = { body: {} }
            request.body = { layout: "text-with-title", heading: "heading", text: "text" }
            await saveAction(request, response, ()=>{}) // save // send POST request instead
            const url = 'http://localhost:8080/page/new/text1'
            const expected = { heading: 'text1', text: "Text." }
            request1(url, expected) // get
            expect(true).toBe(false)
            // get log of server, compare
        })
    })*/
    /*describe('saveSettingsAction', () => {
        it('should saveSettings', async () => {
            let req = { body: { style: "teststyle"} }
            let res = { redirect: (arg) => {} }
            await saveSettingsAction1(req, res, (arg) => { expect(arg).toStrictEqual({ style: req.body.style }) })
        });
    });*/
})