import ejs from 'ejs';

const views = ["_footer.ejs", "_header.ejs"];

const params = {
    websitetitle: "test site",
    routes: [{ "path": "/", "label": "home"}, { "path": "/route1", "label": "Route 1"}, { "path": "/route2", "label": "Route 2"}],
    id: 0,
    path: "/", 
    title: "testpage",
    text: "",
    todo: [],
    issues:[],
    cfg: { build: "debug", version: "0.0" }
}

/*for(let view of views) {
    const file = "views/"+view;
    ejs.renderFile(file, (err, data) => {
        console.log(data)
    });
}*/

const file = "views/"+"text-with-title.ejs";
ejs.renderFile(file, params, (err, data) => {
    console.log(data)
});