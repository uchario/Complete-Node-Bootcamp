const http = require('http');
const url = require('url');
const fs = require('fs');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');
const { toUnicode } = require('punycode');

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, {lower: true}))
console.log(slugs);

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);
    let output;
    switch(pathname) {
        case '/': 
        case '/overview':
            res.writeHead(200, {'Content-Type' : 'text/html'});
            const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
            output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
            console.log(cardsHtml);
            res.end(output);
            break;
        case '/product':
            res.writeHead(200, {'Content-Type' : 'text/html'});
            const product = dataObj[query.id];
            output = replaceTemplate(tempProduct, product);
            res.end(output);
            break;
        case '/api':
            res.writeHead(200, {'Content-Type' : 'application/json'});
            res.end(data);
            break;
        default:
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });
            res.end('<h1>Page not found!</h1>');
    }
});

server.listen(8080, 'localhost', () => {
    console.log('Listening to server on port 8080');
});