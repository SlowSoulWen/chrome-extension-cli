import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main';
import getVersion from '../utils/getVersion';

const DEFAULT_OPTIONS = {
    projectName: 'my-chrome-extension',
    backgroundMode: 'js',
    devTool: false,
}

function parseArgumentsIntoOptions(rawArgs) {
    const args = arg({
        '--name': String, // 项目名称
        '--target': String, // 项目地址
        '--default': Boolean, // 跳过选项并使用默认配置
        '--version': Boolean, // 获取当前版本
        '-n': '--name',
        '-t': '--target',
        '-d': '--default',
        '-v': '--version',
    }, {
        argv: rawArgs.slice(2)
    });
    return {
        getVersion: args['--version'] || false,
        projectName: args['--name'] || '',
        target: args['--target'] || '',
        default: args['--default'] || '',
    };
}

async function promptForMissingOptions(options) {
    const questions = [];
    if (!options.projectName) {
        questions.push({
            type: 'input',
            name: 'projectName',
            message: 'Please input your project name',
            default: DEFAULT_OPTIONS.projectName,
            validate: value => !!value
        });
    }
    questions.push({
        type: 'confirm',
        name: 'devTool',
        message: '是否需要对开发者工具(devTool)做扩展开发?',
        default: DEFAULT_OPTIONS.devTool,
    })
    questions.push({
        type: 'list',
        name: 'backgroundMode',
        message: '请选择background的模式',
        default: DEFAULT_OPTIONS.backgroundMode,
        choices: [
            { name: 'JS', value: 'js' },
            { name: 'HTML', value: 'html' },
        ],
    });
    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        projectName: answers.projectName || options.projectName,
        backgroundMode: answers.backgroundMode,
        devTool: answers.devTool,
    };
}

export async function cli (args) {
    let options = parseArgumentsIntoOptions(args);
    if (options.getVersion) {
        getVersion();
        return;
    }
    if (!options.default) {
        options = await promptForMissingOptions(options);
    } else {
        options = {
            ...options,
            ...DEFAULT_OPTIONS,
        }
    }
    await createProject(options);
}