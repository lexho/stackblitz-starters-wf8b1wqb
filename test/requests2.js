import request from 'request';
import { server } from '../webserver.js';

const gesamtzeit_start = Date.now()
const time = []
let count = 0;
for(let i = 0; i < 10; i++) {
    const start = Date.now();
    time.push(start)
    console.log("start " + i)
    request('http://localhost:8080/', (err, response, body) => {
        //console.log(body)
        const end = Date.now() - time[i]
        console.log("end " + i + " " + end + "ms")
        count++;
        console.log(count)
    })
}

while(count < 9) {  }
console.log("gesamtlaufzeit: " + Date.now() - gesamtzeit_start)
server.close()