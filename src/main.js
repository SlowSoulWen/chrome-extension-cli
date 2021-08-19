import fs from 'fs-extra';
import path from 'path';
import globby from 'globby';
import spawn from 'cross-spawn';
import semver from 'semver';
import inquirer from 'inquirer';
import writeFileTree from '../utils/writeFileTree';
import renderFile from '../utils/renderFile';
import deleteFile from '../utils/deleteFile';
import config from './configuration.js';
import Log from '../utils/log';
import { hasVueCLI } from '../utils/versionCheck';

const log = new Log();
const pkgDevDependencies = {
    "webpack-extension-reloader": "^1.1.4",
    "clean-webpack-plugin": "^3.0.0",
};
// .env mode
let env_mode = `
# The following environment variables will be associated with the relevant configuration on webpack.
# Deletion and modification may cause the program to crash.
`;

function getBackgroundMode (options) {
    const { backgroundMode } = options;
    switch (backgroundMode) {
        case 'js':
        default:
            return {
                scripts: ["./background.js"],
            }
        case 'html':
            return {
                page: "./background.html"
            }
    }
}

async function renderTemplate2TargetProject(target, options) {
    let files = [];
    let versionPath = '';

    // get Vue version
    const pkgJson = await fs.readJSON(path.resolve(target, './package.json'));
    const matchRes = (pkgJson.dependencies.vue || '').match(/(\d+)\.\d+\.\d+/);
    const vueVersion = matchRes ? matchRes[1] : '';

    switch (vueVersion) {
        case '2':
        default:
            versionPath = 'v2';
            break;
        case '3':
            versionPath = 'v3';
            break;
    }
    
    const tmpDirPath = path.resolve(__dirname, `../template/${versionPath}`);
    const tmpFiles = await globby(['**/*'], {
        cwd: tmpDirPath
    });
    for (const filePath of tmpFiles) {
        const sourcePath = path.resolve(tmpDirPath, filePath);
        const content = renderFile(sourcePath);
        if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
            files[filePath] = content;
        }
    };

    // background differentiated configuration
    if (options.backgroundMode === 'js') {
        delete files['src/background/App.vue'];
        files['src/background/index.js'] = "console.log('background...'); // eslint-disable-line \n";
    };

    // devTool differentiated configuration
    if (!options.devTool) {
        delete files['src/devtool/index.js'];
        delete files['src/devtool/App.vue'];
    } else {
        config["devtools_page"] = "devtool.html";
        env_mode += `\nDEVTOOL_MODE=true`;
    }

    // newTab differentiated configuration
    if (!options.newTab) {
        delete files['src/newtab/index.js'];
        delete files['src/newtab/App.vue'];
    } else {
        config["chrome_url_overrides"] = {
            "newtab": "newtab.html"
        };
        env_mode += `\nNEWTAB_MODE=true`;
    }

    await writeFileTree(target, files, {});
}

export async function createProject(options) {
    const cwd = options.target || process.cwd();
    const tarProjectPath = path.resolve(cwd, options.projectName);
    env_mode += `\nBACKGROUND_MODE=${options.backgroundMode}`;

    try {
        fs.statSync(cwd);
        fs.accessSync(cwd, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
        log.error('项目路径不存在或无权限，请检查您的[--target]或者[-t]参数');
        throw err;
    }
    try {
        if (!hasVueCLI()) {
            // Vue-cli is not installed, prompt for installation.
            const answers = await inquirer.prompt({
                type: 'confirm',
                name: 'installVueCLI',
                message: '检查到尚未安装vue-cli，是否安装？',
                default: true,
            });
            if (answers.installVueCLI) {
                log.success('👋    正在安装vue-cli...');
                spawn.sync('npm', ['install', '@vue/cli', '-g'], {
                    cwd,
                    stdio: 'inherit',
                });
            } else {
                throw {
                    msg: '请先安装vue-cli：\n执行 npm install -g @vue/cli 或者 yarn global add @vue/cli',
                    type: 'warning'
                }
            }
        }

        // check vue-cli version
        const { stdout } = spawn.sync('vue', ['--version'], {
            encoding: 'utf-8',
        });
        if (stdout) {
            const [version] = stdout.match(/(\d+\.\d+\.\d)/);
            if (!semver.satisfies(version, '>=3.x')) {
                // vue-cli version too low
                throw {
                    msg: '当前安装的vue-cli版本太低，请更新至3.x以上版本',
                    type: 'warning',
                }
            }
        }

        // create vue project by vue-cli
        log.success('🚗    正在启动vue-cli...');
        spawn.sync('vue', ['create', options.projectName, '--no-git'], {
            cwd,
            stdio: 'inherit',
        });

        log.clearLog();
        log.success(`🏠   vue-cli项目构建成功，正在配置chrome扩展相关内容...`);

        // delete useless files
        deleteFile(`${tarProjectPath}/src/main.js`);
        deleteFile(`${tarProjectPath}/src/App.vue`);

        // add chrome extension template to target project
        await renderTemplate2TargetProject(tarProjectPath, options);

        // update package.json
        const pkgJson = await fs.readJSON(path.resolve(tarProjectPath, './package.json'));
        if (pkgJson) {
            const { devDependencies } = pkgJson;
            pkgJson.devDependencies = {
                ...devDependencies,
                ...pkgDevDependencies,
            }
        }
        await writeFileTree(tarProjectPath, {
            'package.json': JSON.stringify(pkgJson, null, 2) + '\n',
        });

        // set chrome extension manifest.json
        const finalConfig = {
            ...config,
            background: getBackgroundMode(options),
            description: options.description || 'a chrome extension',
            name: options.projectName || 'chrome-extension-app',
        };
        await writeFileTree(tarProjectPath, {
            'src/manifest.json': JSON.stringify(finalConfig, null, 2) + '\n',
        });

        // set .env
        await writeFileTree(tarProjectPath, {
            '.env': env_mode,
        });

        // install node_module
        log.success(`📦   正在更新依赖...`);
        spawn.sync('npm', ['install', '--loglevel', 'error', '--registry=https://registry.npm.taobao.org'], {
            cwd: tarProjectPath,
            stdio: 'inherit',
        });

        // success
        log.success('\n');
        log.success('🎉  Successfully created project');
        log.success(`👉  Get started with the following commands:\n\n` + 'npm run serve');

    } catch (err) {
        const { msg, type = 'error' } = err;
        if (msg) {
            log[type](msg);
        } else {
            console.error(err);
        }
    }
}