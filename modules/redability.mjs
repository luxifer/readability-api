import jsdom from 'jsdom';
const { JSDOM } = jsdom;
import { Readability } from '@mozilla/readability';

export function getArticle(content, articleUrl) {
    let dom = new JSDOM(content, {
        url: articleUrl
    });

    return new Readability(dom.window.document).parse();
}
