const http = require('http');
const url = require('url');
const { getUrl, getArticle } = require('./redability.js');

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;

    if (typeof query.url === 'undefined') {
        res.statusCode = 400;
        res.statusMessage = 'Bad request';
        res.end();
    }

    getUrl(query.url)
        .then((content) => {
            const article = getArticle(content, query.url)
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

const port = process.env.PORT ? process.env.PORT : 4567;
server.listen(port);
