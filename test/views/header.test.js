import ejs from 'ejs';

describe('view', () => {
    /*const page = req.page
    const cfg = req.cfg
    cfg.routes = req.routes;
    cfg.todo = req.todo;
    const content = req.content;

    if(cfg.loadOnTheFly) await req.loadContentFromFile();
    const id = page.id;
    const layout = page.layout;
    const title = page.title;
    const text = page.text;
    const images = page.images;
    
    // View with content
    if(layout == "text-with-title")
        res.render('text-with-title', { cfg: cfg, title: title, id: id, text: text })*/
    const params = {
        cfg:  { build: "debug", version: "0.0",websitetitle: "test site",
            routes: [{ "path": "/", "label": "home"}, { "path": "/route1", "label": "Route 1"}, { "path": "/route2", "label": "Route 2"}] }, 
        title: "title", 
        id: 0, 
        text: "text"
    }
    const file = "views/_header.ejs"; // try assets/fake.ejs to test the test, all tests should fail
    beforeAll(() => {

    })
    describe('_header.ejs', () => {
        it('should be valid html', () => {
            ejs.renderFile(file, params, (err, data) => {
                console.log(data)
                expect(data).toContain("<html")
                expect(data).toContain("<head>")
                expect(data).toContain("<title>")
                expect(data).toContain("</title>")
                expect(data).toContain("</head>")
                expect(data).toContain("<body>")
            });
            
        });
        it('should render header view title', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain(`<title>${params.cfg.websitetitle}</title>`)
            });
        });
        it('should render header view menu', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain('<li class="nav-item"><a class="nav-link navbar-brand align-middle" href="/">home</a></li>')
                //expect(data).toContain(`<li class="nav-item"><a class="nav-link align-middle" href="${params.routes[1].path}">${params.routes[1].label.toLowerCase()}</a></li>`)
                
                for(let route of params.cfg.routes) {
                    expect(data).toContain(`<li class="nav-item"><a class="nav-link align-middle" href="${route.path}">${route.label.toLowerCase()}</a></li>`)
                }
            });
        });
        it('should render header view debuginfo', () => {
            ejs.renderFile(file, params, (err, data) => {
                //expect(data).toContain('<div class="h-100 d-inline-block">' + params.cfg.build + ' ' + params.cfg.version + '</div>')
                expect(data).toContain(`<div class="h-100 d-inline-block">${params.cfg.build} ${params.cfg.version}</div>`)
            });
        });
    });
});