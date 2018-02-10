const { getUrl, getArticle } = require('./redability.js');

exports.handler = function (event, context, callback) {
    console.log(event.url);
    getUrl(event.url)
        .then((content) => {
            const article = getArticle(content, event.url);
            callback(null, article);
        })
        .catch((err) => {
            console.error(err);
        });
}
