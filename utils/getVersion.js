import fs from 'fs-extra';
import path from 'path';
import Log from './log';

const log = new Log();

export default async () => {
    const pkgJson = await fs.readJSON(path.resolve(__dirname, '../package.json'));
    const { version } = pkgJson;
    version && log.success(`current version: v${version}`);
}