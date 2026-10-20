# 新版作品集

当前进度：PHASE 2、3 已实现；PHASE 4 已接入 12 件作品的关系图原型，支持分类展开、节点聚焦、缩放、复位及基础概况。视觉仍供用户审阅，完整作品数据、多端展示等后续章节待继续。见 [PHASE 3 报告](docs/phase-3-report.md)和 [PHASE 4 报告](docs/phase-4-report.md)。用户计划书为 [文档.md](文档.md)，首页以其后用户确认的中文标题、流体玻璃、小票和白点入场为准。

## 本地预览

在 `New` 文件夹打开终端：

```text
npm ci
npm run dev
```

访问 `http://127.0.0.1:5173/Portfolio-YoungSliker/New/`。

生产构建与预览：

```text
npm run build
npm run preview
```

访问 `http://127.0.0.1:4173/Portfolio-YoungSliker/New/`。开发和预览会从原仓库读取旧素材，不复制媒体。

验证：`npm run typecheck`、`npm run test:unit`；浏览器首次准备运行 `npx playwright install chromium`，然后 `npm run build`、`npm test`。浏览器测试会自行启动 4173 端口，请先关闭使用该端口的手动预览。

本机已安装 Edge 时，可在 PowerShell 设置 `$env:PW_BROWSER_CHANNEL = 'msedge'` 后执行 `npm test`，无需额外下载 Chromium。本阶段使用此方式验证。

`dist` 不是独立可搬走的站点：发布时其内容需要位于旧网站同级的 `New/` URL 下，保留父级旧素材与首页。当前没有改变 GitHub Pages 发布配置。不要直接用文件管理器双击开发入口，也不要把开发源文件误当作已构建站点发布。

## 本阶段交付

- [素材审计](docs/asset-audit.md)
- [旧站入口映射](docs/legacy-mapping.md)
- [技术决策](docs/technical-decisions.md)
- [内容核对清单](docs/content-review.md)
- [完整名称索引](docs/work-index.md)

三大作品目录 817 个文件，公共资源 36 个；作品数量不能用文件数量代替。审计只覆盖本地文件和静态代码，浏览器验收在后续阶段进行。

## 文件分类

- `css/`：样式。
- `js/`：页面交互与模块。
- `py/`：需要时使用的素材处理、检查脚本。
- `data/`：项目、经历及素材数据。
- `assets/images/`：新版新增图片。
- `assets/videos/`：新版新增视频。
- `assets/fonts/`：新版新增字体。
- `docs/`：需求来源、实施记录与计划。

页面入口为 `New/index.html`，React/TypeScript 在 `js/`，纯样式在 `css/`。构建产物在 `dist/`（不入库），阶段截图在 `docs/screenshots/`。现有素材优先复用，不批量复制到新版目录。空目录使用 `.gitkeep` 保留。

需求记录见 [需求与进度](docs/01-requirements-and-progress.md)。现有素材清单见 [existing-assets.json](data/existing-assets.json)，路径相对于仓库根目录，清单中的文件不等同于独立作品。
