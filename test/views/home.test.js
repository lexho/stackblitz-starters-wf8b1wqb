import ejs from 'ejs';

describe('view', () => {
                    /* cfg2.routes = routes;
        cfg2.todo = todo;
        cfg2.issues = issues;
        cfg2.websitetitle = cfg.websitetitle
        const cfg1 = cfg2
        res.render('home', { cfg: cfg1, websitetitle: cfg1.websitetitle, text: "" })*/
    const params = {
        cfg:  { build: "debug", version: "0.0", websitetitle: "test site",
            routes: [{ "path": "/", "label": "home"}, { "path": "/route1", "label": "Route 1"}, { "path": "/route2", "label": "Route 2"}],
        todo: [], issues: []
        }, 
        websitetitle: "test site",
        text: ""
    }
    const file = "views/home.ejs"; // try assets/fake.ejs to test the test, all tests should fail
    beforeAll(() => {

    })
    describe('home.ejs', () => {
        it('should be valid html', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain("<html")
                expect(data).toContain("<head>")
                expect(data).toContain("<title>")
                expect(data).toContain("</title>")
                expect(data).toContain("</head>")
                expect(data).toContain("<body>")
                expect(data).toContain("</body>")
                expect(data).toContain("</html>")
            });
            
        });
        it('should render home view title', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain(`<title>${params.websitetitle}</title>`)
            });
        });
        it('should render home view menu', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain('<li class="nav-item"><a class="nav-link navbar-brand align-middle" href="/">home</a></li>')
                //expect(data).toContain(`<li class="nav-item"><a class="nav-link align-middle" href="${params.routes[1].path}">${params.routes[1].label.toLowerCase()}</a></li>`)
                
                for(let route of params.cfg.routes) {
                    expect(data).toContain(`<li class="nav-item"><a class="nav-link align-middle" href="${route.path}">${route.label.toLowerCase()}</a></li>`)
                }
            });
        });
        it('should render home view debuginfo', () => {
            ejs.renderFile(file, params, (err, data) => {
                //expect(data).toContain('<div class="h-100 d-inline-block">' + params.cfg.build + ' ' + params.cfg.version + '</div>')
                expect(data).toContain(`<div class="h-100 d-inline-block">${params.cfg.build} ${params.cfg.version}`)
            });
        });
    });
});