import request from 'request';
import { getContent } from '../model.js';
import { start, stop } from '../webserver.js'

const numberOfRequests = 10

async function asyncFunction(limit) {
    for(let i = 0; i < numberOfRequests; i++) {
        await request1(limit);
    }
}

function request1(limit) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        //console.log("start")
        request('http://localhost:8080/', (err, response, body) => {
            expect(response).toBeDefined()
            const timeEnd = Date.now() - start
            //console.log("end " + timeEnd + "ms")
            //console.log("time "+ timeEnd)
            if(limit >= 5) expect(timeEnd).toBeLessThan(limit) // less than 100ms per request
            if(limit < 5) expect(timeEnd).toBeGreaterThan(limit) // so schnell ist kein programm
            resolve()
        })
    })
}

async function asyncFunction2(limit, path) {
    for(let i = 0; i < numberOfRequests; i++) {
        await request11(limit, path);
    }
}

function request11(limit, path) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        //console.log("start")
        request('http://localhost:8080'+path, (err, response, body) => {
            expect(response).toBeDefined()
            const timeEnd = Date.now() - start
            //console.log("end " + timeEnd + "ms")
            //console.log("time "+ timeEnd)
            if(limit >= 5) expect(timeEnd).toBeLessThan(limit) // less than 100ms per request
            if(limit < 5) expect(timeEnd).toBeGreaterThan(limit) // so schnell ist kein programm
            resolve()
        })
    })
}


describe('server', () => {
    beforeAll(() => {
        start();
    });
    afterAll(() => {
        stop();
    })
    describe('request \'/\'', () => {
        it('server should be running', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 5000)
            //server.listen(8189, () => {})
            await asyncFunction(5000);
            //server.close()
        });
        it('should respond in less than 1000ms', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 2000)
            //server.listen(8189, () => {})
            await asyncFunction(1000);
            //server.close()
        });
        it('should respond in less than 100ms', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 2000)
            //server.listen(8189, () => {})
            await asyncFunction(100);
            //server.close()
        });
        it('should not respond in less than 1ms', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 2000)
            //server.listen(8189, () => {})
            await asyncFunction(1);
            //server.close()
        });
    });

    let routes = ['/text1', '/text2', '/gall1', '/gall2']
    for(let route of routes) {
    describe('request '+ route, () => {
        it('should respond in less than 4000ms', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 5000)
            await asyncFunction2(4000, route);
            //server.close()
        });
        it('should respond in less than 1000ms', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 2000)
            await asyncFunction2(1000, route);
            //server.close()
        });
        it('should respond in less than 100ms', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 2000)
            await asyncFunction2(100, route);
            //server.close()
        });
        it('should not respond in less than 1ms', async () => {
            setTimeout(async() => { expect(undefined).toBeDefined() }, 2000)
            await asyncFunction2(1, route);
            //server.close()
        });
    });
    }
});