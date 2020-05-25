import { createServer } from 'http';
import { parse } from 'url';
import { getArticle } from './modules/redability.mjs';
import fetch from 'node-fetch';

const server = createServer((req, res) => {
    const query = parse(req.url, true).query;

    if (typeof query.url === 'undefined') {
        res.statusCode = 400;
        res.statusMessage = 'Bad request';
        res.end();
        return
    }

    fetch(query.url)
        .then(res => res.text())
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
