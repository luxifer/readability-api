const http = require('http');
const url = require('url');
const { Readability, JSDOMParser } = require('readability/index');

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;

    if (typeof query.url === 'undefined') {
        res.statusCode = 400;
        res.statusMessage = 'Bad request';
        res.end();
    }

    http.get(query.url, (response) => {
        let content = '';

        response.on('data', (chunk) => { content += chunk; });
        response.on('end', () => {
            let document = new JSDOMParser().parse(content);
            const loc = url.parse(query.url, true);
            const uri = {
                spec: loc.href,
                host: loc.host,
                prePath: loc.protocol + "//" + loc.host,
                scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
                pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
            };
            let article = new Readability(uri, document).parse();
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(article));
            res.end();
        });
    });
});

server.listen(4567);
