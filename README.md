# webserver.js - Basismodul

#### run locally
    npm install
    npm start
#### start docker container
    docker run -v "%cd%\config:/usr/src/app/config" -p 8080:8080 --rm --name webserver.js webserver.js

edit config files
- config.json
- content.json