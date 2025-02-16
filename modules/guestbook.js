import { copyFile, unlink } from 'node:fs';
export class Guestbook {
    constructor() {
        this.route = "/guestbook";
    }
    install() {
        const src = "modules/guestbook.ejs";
        const dest = "views/modules/guestbook.ejs";
        copyFile(src, dest, this.callback);
        return false;
    }
    uninstall() {
        const file = 'views/modules/guestbook.ejs';
        unlink(file, (err) => {
            if (err)
                throw err;
            console.log(file + ' was deleted');
        });
        return false;
    }
    action(req, res) {
        console.log("module action");
        //const cfg = {routes: [], todo: [], websitetitle: ""}
        //cfg.routes = req.routes
        //cfg.websitetitle = req.cfg.websitetitle
        const cfg = req.cfg;
        const title = "guestbook";
        const id = 0;
        const text = "text";
        //const folderName = '/Users/joe/test';
        // ein eigenes guestbook layout; yes!!!!!
        res.render('modules/guestbook', { cfg: cfg, title: title, id: id, text: text });
    }
    callback() {
        console.log('source.txt was copied to destination.txt');
    }
}
