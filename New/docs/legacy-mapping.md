# PHASE 0 — 旧站入口映射

下表是静态代码确认的调用关系，不代表这些案例已经有可分享的独立 URL。

| 内容 | 旧站入口 / 定位依据 | 源文件 | 迁移判断 |
|---|---|---|---|
| 首页 | `showPage('home')` | `js/page-core-692.js` | 保留根入口 |
| AIGC 分类 | `showPage('aigc')` | 同上 | 分类切换 |
| 数字体验分类 | `showPage('creative')` | 同上 | 分类切换 |
| 视觉传达分类 | `showPage('ui')` | 同上 | 分类切换 |
| 绥远方志 | `openProject('suiyuan')`，`#project-detail` | `js/page-core-692.js` | 有详情容器 |
| 矿山*生态 | `openProject('mine-eco')`，`#mine-eco-detail` | `js/mine-eco-683.js` | 包装前一个 openProject |
| 微元灵溯 | `openProject('weiyuan')`，`#weiyuan-detail` | `js/weiyuan-708.js` | 有详情、图片预览和视频 |
| 新媒体艺术展厅 | `openProject('new-media')` | `js/gallery-751.js` | 展厅入口，不是单件作品直达 |
| 新媒体具体作品 | `NEW_MEDIA_WORKS` 的 0–8 ID | `js/gallery-data-742.js` | 数据可复用，单件公开打开 API 未确认 |
| APP | 导航 `data-nav-page="creative"`、`data-nav-card="1"`；弹窗内 `data-project` | `js/app-card-790.js` | 事件拦截、内部弹窗状态 |
| AIGC 实验 | 内嵌数据和组件交互 | `js/drift-735.js` | 未确认公开项目直达 API |
| 视觉作品 | 内部 `jumpToWork(index)`，展示数组索引 0–39 | `js/visual-menu-813.js` | 函数处于闭包，不是公共接口 |

`js/hybrid-navigation-705.js` 的 `followPortfolioNavAction` 根据导航属性先调用 `showPage`，随后调用 `openProject` 或滚动到卡片。视觉导航还有独立拦截，LOGO 和其他作品的入口存在随机选择逻辑，不能用它保证某一作品直达。

## 跨页跳转结论

目前检查的应用入口中没有确认完整的 URL → 项目状态恢复机制。打包 React 内部出现 `popstate/hashchange` 字样，不等同于业务已实现路由。

因此暂不把 `../index.html#作品名` 填成正式案例链接；普通 hash 无法自动完成分类激活、详情打开及资源初始化。

## 分阶段兼容方案

1. PHASE 1：新版只提供经过验证的旧站首页入口；项目 `detailUrl` 在直达实现前保持空值或待接入状态。
2. PHASE 5：对三大 AIGC 详情先增加稳定 ID 映射，等待页面及包装函数就绪后打开。对展厅、APP 和视觉作品再提供显式公共适配接口，避免脆弱的随机导航与固定延时模拟点击。
3. 优先评估同仓库、同源的 `New/legacy/` 兼容入口，保持旧站资源基准；是否需要给根页面增加最小路由脚本，在该阶段依据运行验证决定。当前不修改旧站。
4. 新版 URL 状态用 hash 或查询参数表达作品 ID，支持刷新、返回和前进；未知 ID 显示明确提示。
5. 每条正式 `detailUrl` 必须用浏览器验证目标作品标题，不能仅检查 HTTP 200。

若部署新版与旧版到不同源，不能依赖 iframe DOM 访问。部署路径与兼容入口要一起验证。
