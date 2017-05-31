const http = require('follow-redirects').http;
const url = require('url');
const { Readability } = require('readability/index');
const contentType = require('content-type');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;

    if (typeof query.url === 'undefined') {
        res.statusCode = 400;
        res.statusMessage = 'Bad request';
        res.end();
    }

    getUrl(query.url)
        .then((content) => {
            let dom = new JSDOM(content, {
                url: query.url
            });
            const loc = url.parse(query.url, true);
            const uri = {
                spec: loc.href,
                host: loc.host,
                prePath: loc.protocol + "//" + loc.host,
                scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
                pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
            };
            let article = new Readability(uri, dom.window.document).parse();
            res.setHeader('Content-Type', 'application/json');
            res.write(JSON.stringify(article));
            res.end();
        })
        .catch((err) => {
            console.error(err);
            res.statusCode = 400;
            res.statusMessage = 'Bad request';
            res.write(JSON.stringify({
                'error': err.message
            }));
            res.end();
        });
});

function getUrl(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let obj = contentType.parse(res.headers['content-type']);
            if (obj.type != 'text/html') {
                reject(new Error('Accept only text/html'));
            }

            let content = '';
            res.on('data', (chunk) => { content += chunk; });
            res.on('end', () => { resolve(content); });
            res.on('err', (err) => { reject(err); })
        });
    });
}

const port = process.env.PORT ? process.env.PORT : 4567;
server.listen(port);
