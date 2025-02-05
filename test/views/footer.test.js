import ejs from 'ejs';

describe('view', () => {
    const params = {
        text: "",
        todo: [],
        issues:[],
    }
    const file = "views/_footer.ejs"; // try assets/fake.ejs to test the test, all tests should fail
    beforeAll(() => {

    })
    describe('_footer.ejs', () => {
        it('should be valid html', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain("</body>")
                expect(data).toContain("</html>")
            });
            
        });
        it('should render footer view notesbox', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain(`<aside class="container-fluid notesbox">`)
            });
        });
        it('should render footer view bootstrap javascript tag', () => {
            ejs.renderFile(file, params, (err, data) => {
                expect(data).toContain('<script src="/js/bootstrap.bundle.min.js"></script>')
            });
        });
    });
});