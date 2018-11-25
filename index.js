const fs = require('fs');
const http = require('http');
const url = require('url');

const products = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const json = JSON.parse(products);

const server = http.createServer((req, res) => {
    const path = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    
    if (path == '/' || path == '/products') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile(`${__dirname}/products.html`, 'utf-8', (err, data) => {
            let output = data;

            fs.readFile(`${__dirname}/data/template/template-card.html`, 'utf-8', (err, data) => {
                const cards = json.map(e => replaceTemplate(data, e)).join('');
                output = output.replace('{%CARDS%}', cards);
                res.end(output);
            })
            
        });
    }else if (path == '/product-detail' && id < json.length+1) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        fs.readFile(`${__dirname}/product-detail.html`, 'utf-8', (err, data)=> {
            const note = json[id-1];
            const out = replaceTemplate(data, note);
            res.end(out);
        })
    }else if ((/\.(jpg|jpeg|png|gif)$/i).test(path)) {
        fs.readFile(`${__dirname}/data/img${path}`, (err, data) => {
            res.writeHead(200, {'Content-Type': 'img/jpg'});
            res.end(data);
        })
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('URL não encontrada!');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('server listening on port 3000');
});

function replaceTemplate(html, product) {
    let response = html.replace(/{%NOME%}/g, product.nome);
    response = response.replace(/{%MODELO%}/g, product.modelo);
    response = response.replace(/{%VALOR%}/g, product.valor);
    response = response.replace(/{%DESCRICAO%}/g, product.descricao);
    response = response.replace(/{%IMG%}/g, product.imagem);
    response = response.replace(/{%ID%}/g, product.id);
    return response;
}