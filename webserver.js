import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
//import removeRoute from 'express-remove-route'; // phantom pages
import cors from 'cors';
import { ensureLoggedIn } from 'connect-ensure-login';

import { router } from './routing.js';
import { writeToFile } from './models/storage_ram.js';
import { getConfig } from './models/model_async.js';
import { ErrorPage } from './views/page.js';
import auth from './helpers/auth.js';
import { login } from './config.js';

const app = express();
export function start() {
    app.set('view engine', 'ejs')

    app.use(express.static(`${dirname(fileURLToPath(import.meta.url))}/public`))
    app.use(express.json())

    app.use(morgan('common', { immediate: true }));

    app.use(express.urlencoded({ extended: false }));

    auth(app);
    //login() // override login TODO remove

    app.use(cors())

    //app.use('/', ensureLoggedIn('/login.html'), router); // (req, res, next) => { next() } // admin bereich
    app.use('/', function(req, res, next) {  next() }, router );
    //app.use('/', router); // öffentlicher bereich

    //app.use('/', (req,res,next) => {}, router)
    app.get('/login', (req, res) => { res.redirect('/login.html'); /*res.redirect('/')*/ })
    //app.get('/logout1', (req, res) => { logout(); res.redirect('/') })

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
const server = app.listen(8080, () => {
    console.log('App erreichbar unter http://localhost:8080')
});

// Using a single function to handle multiple signals
function handle(signal) {
    //console.log(`Received ${signal}`);
    server.close(async() => {
        console.log('HTTP server closed')
        await writeToFile()
    })
  }

process.on('SIGINT', handle);
process.on('SIGTERM', handle);