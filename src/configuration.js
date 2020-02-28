export default {
    browser_action: {
        "default_popup": "./popup.html"
    },
    content_scripts: [{
        "all_frames": false,
        "js": ["./contentScripts.js"],
        "matches": ["http://*/*", "https://*/*"],
        "run_at": "document_start"
    }],
    icons: {
        "16": "assets/logo.png",
        "32": "assets/logo.png",
        "64": "assets/logo.png",
        "128": "assets/logo.png"
    },
    manifest_version: 2,
    options_ui: {
        chrome_style: false,
        page: "./options.html"
    },
    // 权限申请
    permissions: [
        "contextMenus", // 右键菜单
        "tabs", // 标签
        "notifications", // 通知
        "webRequest", // web请求
        "webRequestBlocking", // 阻塞式web请求
        "storage", // 插件本地存储
        "http://*/*", // 可以通过executeScript或者insertCSS访问的网站
        "https://*/*" // 可以通过executeScript或者insertCSS访问的网站
    ],
    "version": "1.0.0",
    "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"
}