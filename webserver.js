import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import removeRoute from 'express-remove-route'; // phantom pages
import cors from 'cors';

import { router, getPageConfig } from './routing.js';
import { writeToFile } from './storage_ram.js';
import ejs from 'ejs';
import { getConfig } from './model_async.js'
import { ErrorPage } from './page.js'

const app = express();
export function start() {
    //app = express(); // TODO changed
    //app = express(); // TODO changed

    app.set('view engine', 'ejs')
    app.set('view engine', 'ejs')

    app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
    app.use(express.json())
    app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
    app.use(express.json())

    app.use(morgan('common', { immediate: true }));
    app.use(morgan('common', { immediate: true }));

    app.use(express.urlencoded({ extended: false }));
    app.use(express.urlencoded({ extended: false }));

    app.use(cors())
    app.use(cors())

    app.use('/', router); // (req, res, next) => { next() }
    app.use('/', router); // (req, res, next) => { next() }

    app.use((req, res, next) => {
        const page = new ErrorPage("Error 404", "Seite nicht gefunden.", "")
        page.render(res)
        //res.status(404).send('Sorry cant find that!')
    })
    app.use(async(err, req, res, next) => {
        console.error(err.code)
        console.error(err.message)
        console.error(err.stack)
        let stack = ""
        const cfg1 = await getConfig()
        if(cfg1.build == "debug") stack = err.stack;
        //res.render('error', { title: "Error 500", message: message, stacktrace: stack, cfg: cfg } )
        const page = new ErrorPage("Error 500", "Internal Server Error.", stack)
        page.render(res)
        //res.status(500).send('Something broke!')
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