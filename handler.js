'use strict';

const { getUrl, getArticle } = require('./redability.js');

module.exports.urlToArticle = function (event, context, callback) {
    const url = event.queryStringParameters.url;
    getUrl(url)
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
