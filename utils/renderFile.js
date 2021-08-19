import ejs from 'ejs';
import { isBinaryFileSync } from 'isBinaryFile';
import fs from 'fs-extra';

const yaml = require('yaml-front-matter');

export default function renderFile(name) {
    if (isBinaryFileSync(name)) {
        return fs.readFileSync(name) // return buffer
    }
    const template = fs.readFileSync(name, 'utf-8');
    const parsed = yaml.loadFront(template);
    const content = parsed.__content;
    const finalTemplate = content.trim() + `\n`;
    try {
        ejs.render(finalTemplate, null, {});
    } catch(err) {
        console.log('err', err);
    }
    return ejs.render(finalTemplate, null, {});
}