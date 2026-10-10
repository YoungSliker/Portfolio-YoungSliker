# 901：手机横屏静态前景分组

入口为 `index.html` 和同内容的 `901index.html`。仅在横屏且视口高度不超过 500px 时启用；桌面继续使用原有页面。

`css/mobile-static-901.css` 和 `js/mobile-static-901.js` 替换 900 的整页图片覆盖层。图片加载成功后才隐藏对应原始图形；加载失败时保留原界面。

素材位于 `主界面/mobile-static/901/`，共 15 张：

| 页面 | WebP 分组 | 继续实时渲染的内容 |
| --- | --- | --- |
| 首页 | home-foreground：边框、前景装饰、标题、标贴和文字条 | 原视频、背景、2026 动效 |
| 我的信息 | profile-art：头像、黄色和粉色色块、动漫图、边框；profile-signature：底部签名与年份；profile-tools：7 个工具图标 | 信息标题及正文、页面背景 |
| 作品导航 | works-heading、works-card-0/1/2 | 原背景与模糊；独立的分类和项目跳转按钮 |
| AIGC | aigc-heading、aigc-card-0/1/2 | 作品墙、滚动容器与详情页 |
| 数字体验 | creative-heading、creative-card-0/1 | TD 波形画布、APP 终端画布、卡片背景遮罩、滚动与详情 |

工具组边缘淡出并虚化；16:9 内容区域外的侧边使用实时背景模糊，不复制整页图片。导航热点位置来自导出时的真实按钮范围，调用原跳转逻辑；工具链接保留原网址。

## 更新素材

从网站目录启动本地静态服务，再用有 Playwright 和 Sharp 的开发环境运行：

```text
node js/export-static-ui-901.cjs http://127.0.0.1:8765/
```

默认使用本机 Edge；可用 `STATIC_UI_BROWSER` 指定 Playwright 浏览器渠道。导出器直接从桌面原始 DOM 截取指定组，排除其他元素与背景，保留透明通道，并生成尺寸与热点清单 `manifest.json`。导出时禁用 900/901 运行层，避免重复栅格化。

本次截图检查、交互验证脚本和结果归档于 `Del/static-901/`，不参与正式页面加载。
