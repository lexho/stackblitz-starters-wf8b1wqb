import request from 'request';
import { getContent } from '../model.js';

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
        request('http://localhost:8189/', (err, response, body) => {
            //console.log(body)
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
        request('http://localhost:8189'+path, (err, response, body) => {
            //console.log(body)
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
    beforeEach(() => {
        ////server.listen(8189, () => {})
    });
    describe('request \'/\'', () => {
        it('should respond in less than 1000ms', async () => {
            //server.listen(8189, () => {})
            await asyncFunction(1000);
            //server.close()
        });
        it('should respond in less than 100ms', async () => {
            //server.listen(8189, () => {})
            await asyncFunction(100);
            //server.close()
        });
        it('should respond in less than 10ms', async () => {
            //server.listen(8189, () => {})
            await asyncFunction(10);
            //server.close()
        });
        it('should respond in less than 5ms', async () => {
            //server.listen(8189, () => {})
            await asyncFunction(5); //5ms: wackelkandidat kann er so schnell sein? darf er so schnell sein?
            //server.close()
        });
        it('should not respond in less than 1ms', async () => {
            //server.listen(8189, () => {})
            await asyncFunction(1);
            //server.close()
        });
    });

    let routes = ['/aboutme', '/myinstrument', '/samples', '/aboutthispage']
    let route = '/aboutme'
    for(let route of routes) {
    describe('request '+ route, () => {
        it('should respond in less than 1000ms', async () => {
            await asyncFunction2(1000, route);
            //server.close()
        });
        it('should respond in less than 100ms', async () => {
            await asyncFunction2(100, route);
            //server.close()
        });
        it('should respond in less than 10ms', async () => {
            await asyncFunction2(10, route);
            //server.close()
        });
        it('should respond in less than 5ms', async () => {
            await asyncFunction2(5, route); //5ms: wackelkandidat kann er so schnell sein? darf er so schnell sein?
            //server.close()
        });
        it('should not respond in less than 1ms', async () => {
            await asyncFunction2(1, route);
            //server.close()
        });
    });
    }
});