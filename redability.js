const contentType = require('content-type');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { Readability } = require('readability/index');
const request = require('request');
const url = require('url');

exports.getUrl = function (articleUrl) {
    return new Promise((resolve, reject) => {
        request.get(articleUrl, (error, response, body) => {
            if (error) {
                reject(error);
            }

            resolve(body);
        });
    });
}

exports.getArticle = function (content, articleUrl) {
    let dom = new JSDOM(content, {
        url: articleUrl
    });
    const loc = url.parse(articleUrl, true);
    const uri = {
        spec: loc.href,
        host: loc.host,
        prePath: loc.protocol + "//" + loc.host,
        scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
        pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
    };

    return new Readability(uri, dom.window.document).parse();
}
