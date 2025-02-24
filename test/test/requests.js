import request from 'request';
import { createServer } from 'http';

const server = createServer((request, response) => {
    response.end("good bye")
}).listen(8089, () => {})

const time = []
let count = 0
async function asyncFunction() {
    for(let i = 0; i < 10; i++) {
        await request1();
    }
}

function request1() {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        //console.log("start")
        request('http://localhost:8089/', (err, response, body) => {
            //console.log(body)
            const end = Date.now() - start
            console.log("end " + end + "ms")
            count++
            resolve()
        })
    })
}

await asyncFunction();
server.close()