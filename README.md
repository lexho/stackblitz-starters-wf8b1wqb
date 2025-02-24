# webserver.js

#### run locally
    npm install
    npx tsc
    npm start
#### start docker container
    # webserver without memory
    docker run -p 8080:8080 --rm --name webserver.js lexho111/webserver.js
    # custom config from config file
    docker run -p 8080:8080 -v %cd%/config:/usr/src/app/config --rm --name webserver.js lexho111/webserver.js
    # custom config, persistent storage of public static content and uploads
    docker run -p 8080:8080 -v %cd%/config:/usr/src/app/config -v %cd%/public:/usr/src/app/public -v %cd%\uploads:/usr/src/app/uploads --rm --name webserver.js lexho111/webserver.js

edit config files from the ./config/ folder
- webserver configuration: config.json
- website content: content.json
- editor's notes (todo-list, issues): editorsnotes.json

#### Customize Style
- select a style from the settings menu in the browser
- or edit the stylesheet style.css in the ./public/ folder
- edit sass files and run ```sass --watch scss/:public/css```

The content.style variable from content.json defines which style will be used.