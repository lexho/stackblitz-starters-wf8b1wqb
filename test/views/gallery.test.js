import ejs from 'ejs';

describe('view', () => {
    const params = { 
        websitetitle: "test site",
        title: "test site", 
        routes: [],
        id: 0, 
        images: [{"url":"foto1.jpg","alt":"testfoto"},{"url":"foto2.jpg","alt":"testfoto"},{"url":"foto3.jpg","alt":"testfoto"},], 
        todo: [], 
        cfg: { build: "debug", version: "0.0" }
    }
    const filename = "gallery";
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
                expect(data).toContain(`<title>${params.websitetitle}</title>`)
            });
        });
        it('should render ' + filename + ' view menu', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                expect(data).toContain('<li class="nav-item"><a class="nav-link navbar-brand align-middle" href="/">home</a></li>')
                //expect(data).toContain(`<li class="nav-item"><a class="nav-link align-middle" href="${params.routes[1].path}">${params.routes[1].label.toLowerCase()}</a></li>`)
                
                for(let route of params.routes) {
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
        it('should render ' + filename + ' view photobox', () => {
            ejs.renderFile(filepath, params, (err, data) => {
                expect(data).toContain('<div id="photobox" class="container-fluid">')
            });
        });
    });
});