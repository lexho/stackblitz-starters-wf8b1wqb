# webserver.js

#### run locally
    npm install
    npm start
#### start docker container
    docker run -v "%cd%\config:/usr/src/app/config" -p 8080:8080 --rm --name webserver.js lexho111/webserver.js

edit config files from the config folder
- config.json
- content.json

#### Customize Style
- edit the stylesheet style.css

The content.style variable from content.json defines which style will be used.