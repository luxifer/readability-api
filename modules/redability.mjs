import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import Readability from 'readability';
import { parse } from 'url';

export function getArticle (content, articleUrl) {
    let dom = new JSDOM(content, {
        url: articleUrl
    });
    const loc = parse(articleUrl, true);
    const uri = {
        spec: loc.href,
        host: loc.host,
        prePath: loc.protocol + "//" + loc.host,
        scheme: loc.protocol.substr(0, loc.protocol.indexOf(":")),
        pathBase: loc.protocol + "//" + loc.host + loc.pathname.substr(0, loc.pathname.lastIndexOf("/") + 1)
    };

    return new Readability(uri, dom.window.document).parse();
}
