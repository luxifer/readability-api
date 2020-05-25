'use strict';

import { getArticle } from './modules/redability.mjs';
import fetch from 'node-fetch';

export function urlToArticle (event, context, callback) {
    const url = event.queryStringParameters.url;
    fetch(query.url)
        .then(res => res.text())
        .then((content) => {
            const article = getArticle(content, url);
            callback(null, {
                statusCode: 200,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(article)
            });
        })
        .catch((err) => {
            console.error(err);
            callback(null, {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    error: err
                })
            });
        });
}
