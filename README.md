# Chrome Extension CLI

### 一个基于vue-cli的Chrome扩展程序开发脚手架

# 功能

- [x] 项目基于vue-cli，组件化开发更加便利
- [x] 支持Vue2.x以及Vue3.x 
- [x] 支持chrome扩展开发过程中的热重载
- [x] 支持开发实时预览
- [x] 一键打包扩展

# 安装

``` shell
npm install crx-vue-cli -g
```
# 使用

``` shell
crx-vue-cli [options]
```

### options选项
- `--name` 项目名称
- `--target` 指定项目创建的地址，默认在当前目录创建项目
- `--default` 跳过选项，使用默认设置

## 开发插件

```shell
cd your-project-name
npm run serve // 开发模式
```

- 根目录下会生成`dist`文件夹
- 打开Chrome浏览器，访问[chrome扩展程序管理页面](chrome://extensions/)（chrome://extensions/）
- 打开右上角`开发者模式`，选择`加载已解压的扩展程序`，选择项目根目录的`dist`文件夹即可加载chrome扩展项目
- 现在你就可以愉快地开发并实时预览你的插件了
  
## 项目结构

生成的项目结构和通过Vue Cli搭建的结构基本相同。

`src`是工程目录，按照插件的模块来划分文件夹，具体的含义可以参考底部的《Chrome插件开发全攻略》一文，此处不再赘述。

通过 `Vue.prototype.chrome = chrome` (Vue2.x) 或者 `app.config.globalProperties.chrome = chrome`(Vue3.x)将`chrome`实例作为Vue的全局属性注入，因此你可以很方便的通过`this.chrome`来调用Chrome插件提供的能力。

## Chrome扩展开发相关文档

[官方文档](https://developer.chrome.com/extensions)

[《Chrome插件开发全攻略》](https://github.com/sxei/chrome-plugin-demo)
