# Chrome Extension CLI

### 一个基于vue-cli的Chrome扩展程序开发脚手架

# 功能

- [x] 项目基于vue-cli，组件化开发更加便利
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

## 开发模式

```shell
cd your-project-name
npm run serve // 开发模式
```

根目录下会生成`dist`文件夹，打开Chrome浏览器，访问[chrome扩展程序管理页面](chrome://extensions/)（chrome://extensions/），打开`开发者模式`，选择`加载已解压的扩展程序`，选择项目根目录的`dist`文件夹即可加载chrome扩展项目，并实时开发预览。

## Chrome扩展开发相关文档

[官方文档](https://developer.chrome.com/extensions)

[《Chrome插件开发全攻略》](https://github.com/sxei/chrome-plugin-demo)
