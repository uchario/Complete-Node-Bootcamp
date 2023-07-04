const EventEmitter = require('events');
const http = require('http')

class Sales extends EventEmitter {
    constructor() {
        super();
    };
}

const myEmitter = new Sales();

// myEmitter.on('new sale', () => console.log('There was a new sale!'));
// myEmitter.on('new sale', () => console.log('Customer name: arich'));
// myEmitter.on('new sale', (stock) => console.log(stock));

// myEmitter.emit('new sale', 9);

const server = http.createServer();
server.on('request', (req, res) => {
    console.log('Request received!');
    res.end('Request received!');
});

server.on('request', (req, res) => {
    console.log('Another request!😇');
});

server.on('close', () => console.log('Server closed!'));

server.listen(8080, 'localhost', () => console.log('Waiting for requests!'));