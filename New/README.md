# 新版作品集

当前进度：PHASE 9 已正式发布并完成公网验收。访问 [新版作品集](https://youngsliker.github.io/Portfolio-YoungSliker/New/)，详见 [PHASE 9 报告](docs/phase-9-report.md)。压缩副本与本地兼容性边界见 [PHASE 8 报告](docs/phase-8-report.md)。用户计划书为 [文档.md](文档.md)，后续用户确认优先于原计划。

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
npm run serve:built
```

访问 `http://127.0.0.1:4173/Portfolio-YoungSliker/New/`。开发和预览会从原仓库读取旧素材，不复制媒体。

验证：`npm run typecheck`、`npm run test:unit`；浏览器首次准备运行 `npx playwright install chromium`，然后 `npm run build`、`npm test`。浏览器测试会自行启动 4173 端口，请先关闭使用该端口的手动预览。

本机已安装 Edge 时，可在 PowerShell 设置 `$env:PW_BROWSER_CHANNEL = 'msedge'` 后执行 `npm test`，无需额外下载 Chromium。本阶段使用此方式验证。

`dist` 不是独立可搬走的站点。完整发布副本生成方式（在 `New` 下，Python 需要 Pillow 12.3.0，兼容视频转码需要 ffmpeg）：

```text
python python/compat-videos.py
npm run build
python python/package-pages.py
python python/verify-pages.py
```

产物在 `release/site/`，同时包含旧版入口、素材和构建后的 `New/`。原始素材不覆盖。PowerShell 设置 `$env:PAGES_PREVIEW='1'` 后运行 `npm run serve:built` 可直接验收此发布副本；结束后删除该环境变量即可恢复源码素材预览。

GitHub Actions 手动流程见仓库 `.github/workflows/pages.yml`：默认只生成发布产物，选择 `publish` 才部署。仓库 Pages 发布源须设置为 GitHub Actions，并先提交本阶段代码与素材。不要把 `release/` 或开发源文件直接当成 Pages 分支目录；工作流会构建并上传正确目录。2026-10-26 已切换到 GitHub Actions 并成功部署；后续更新继续运行此流程。

公网回归：`npx playwright test -c playwright.online.config.ts`，直接访问已发布网站，不启动本地预览。

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
