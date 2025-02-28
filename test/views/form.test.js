import ejs from 'ejs';

describe('view', () => {
    /*const params = {
        websitetitle: "test site",
        routes: [{ "path": "/", "label": "home"}, { "path": "/route1", "label": "Route 1"}, { "path": "/route2", "label": "Route 2"}],
        id: 0,
        title1: "Neue Seite",
        path: "/", 
        title: "testpage",
        text: "",
        todo: [],
        issues:[],
        cfg: { build: "debug", version: "0.0" }
    }*/
        const params = {
            cfg:  { build: "debug", version: "0.0",websitetitle: "test site",
                routes: [{ "path": "/", "label": "home"}, { "path": "/route1", "label": "Route 1"}, { "path": "/route2", "label": "Route 2"}],
            todo: [], issues: []
            }, 
            title: "title", 
            title1: "title1",
            id: 0, 
            path: "",
            photo1: "",
            photo2: "",
            photo3: "",
            images: [{url: "", alt: ""}],
            text: "text"
        }
    // views/form.ejs
    const filename = "form";
    const file = filename + ".ejs"; // try assets/fake.ejs to test the test, all tests should fail
    const filepath = "views/" + file;
    beforeAll(() => {

    })
    describe(file, () => {
        it('should be valid html', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                expect(data).toContain("<html")
                expect(data).toContain("<head>")
                expect(data).toContain("<title>")
                expect(data).toContain("</title>")
                expect(data).toContain("</head>")
                expect(data).toContain("<body>")
            });
            
        });
        it('should render ' + filename + ' view title', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                expect(data).toContain(`<title>${params.cfg.websitetitle}</title>`)
            });
        });
        it('should render ' + filename + ' view menu', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                expect(data).toContain('<li class="nav-item"><a class="nav-link navbar-brand align-middle" href="/">home</a></li>')
                //expect(data).toContain(`<li class="nav-item"><a class="nav-link align-middle" href="${params.routes[1].path}">${params.routes[1].label.toLowerCase()}</a></li>`)
                
                for(let route of params.cfg.routes) {
                    expect(data).toContain(`<li class="nav-item"><a class="nav-link align-middle" href="${route.path}">${route.label.toLowerCase()}</a></li>`)
                }
            });
        });
        it('should render ' + filename + ' view debuginfo', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                //expect(data).toContain('<div class="h-100 d-inline-block">' + params.cfg.build + ' ' + params.cfg.version + '</div>')
                expect(data).toContain(`<div class="h-100 d-inline-block">${params.cfg.build} ${params.cfg.version}</div>`)
            });
        });
        it('should render ' + filename + ' view form', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                //expect(data).toContain('<div action="/page/save" class="container" method="post"')
                expect(data.toLowerCase()).toContain("post")
            });
        });
        it('should render ' + filename + ' view form', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                //expect(data).toContain("method: 'POST'").or.toContain('method="post"')
                expect(data.includes("method: 'POST'") || data.includes('method="post"')).toBeTruthy()
            });
        });
        
        it('should render ' + filename + ' view form', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                expect(data.replace(/\s/g,'')).toContain("submit")
            });
        });
    });
});