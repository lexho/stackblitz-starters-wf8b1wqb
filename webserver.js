import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import removeRoute from 'express-remove-route'; // phantom pages

import { router, getPageConfig } from './routing.js';
import { writeToFile } from './storage_ram.js';
import ejs from 'ejs';

let app;
export function start() {
    app = express(); // TODO changed

app.set('view engine', 'ejs')

app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
app.use(express.json())

app.use(morgan('common', { immediate: true }));

app.use(express.urlencoded({ extended: false }));

app.use('/', router); // (req, res, next) => { next() }

app.use((req, res, next) => {
    const file = "views/error.ejs"
    const cfg = getPageConfig() // page config
    const params = { title: "Error 404", message: "Seite nicht gefunden.", cfg: cfg }
    ejs.renderFile(file, params, (err, html) => {
        res.status(404).send(html)
    });
    //res.status(404).send('Sorry cant find that!')
    //next() // ?
})
app.use((err, req, res, next) => {
    console.error(err.stack)
    const file = "views/error.ejs"
    const cfg = getPageConfig()
    const params = { title: "Error 500", message: "Internal Server Error.", cfg: cfg }
    ejs.renderFile(file, params, (err, html) => {
        res.status(500).send(html)
    });
    //console.error(err.stack)
    //res.status(500).send('Something broke!')
    //next() // ?
})
}

export function stop() {
    server.close(async() => {
        console.log('HTTP server closed')
        await writeToFile()
    })
}

start();
/*export function removeRoute1(route) {
    removeRoute(app, route);
}*/

/** this is an express webserver */
const server = app.listen(8080, () => { // port 8189 for performance test 
    console.log('App erreichbar unter http://localhost:8080')
});

// Using a single function to handle multiple signals
function handle(signal) {
    console.log(`Received ${signal}`);
    server.close(async() => {
        console.log('HTTP server closed')
        await writeToFile()
    })
  }

process.on('SIGINT', handle);
process.on('SIGTERM', handle);