# webserver.js

#### run locally
    npm install
    npm start
#### start docker container
    docker run -v "%cd%\config:/usr/src/app/config" -p 8080:8080 --rm --name webserver.js lexho111/webserver.js

edit config files
- config.json
- content.json

#### Customize Style
- edit the stylesheet style.css
content.style from content.json defines which style will be used