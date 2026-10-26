# PHASE 9：正式发布与线上验收

日期：2026-10-26。原计划止于 PHASE 8；按用户继续推进要求，将尚未完成的正式发布和公网验收记为 PHASE 9，不增加页面功能。

## 发布前发现

- 本地与远端主分支均为 `b239d59`。
- 原 Pages 分支发布运行 `40260067024` 在 Jekyll 构建步骤失败。
- 公网 `/New/` 虽返回 HTTP 200，仍引用开发源文件 `/js/app/main.tsx`，不能据此判断新版上线。
- 用户已按照指引启动 `Build compressed portfolio for Pages`，运行 `40261500007`。构建、兼容视频转码、压缩、校验及正式部署全部成功。

## 验收方式

使用 `npx playwright test -c playwright.online.config.ts` 直接访问 GitHub Pages，不启用本地服务。检查六种视口、媒体、作品详情与中文路径。部署成功后还须检查线上入口引用生产构建脚本。

## 最终结果

- [GitHub Actions 发布记录](https://github.com/YoungSliker/Portfolio-YoungSliker/actions/runs/40261500007)：build、deploy 均成功，发布提交 `b239d59`。
- [新版线上入口](https://youngsliker.github.io/Portfolio-YoungSliker/New/) 返回 200，加载 `/Portfolio-YoungSliker/New/assets/index-gttP9ngQ.js`，不再引用开发入口。
- 云端副本实际 820,818,849 字节（约 821 MB），1342 个文件，1125 张图片检查通过；云端源文件哈希保持不变。与本地体积略有差别，云端重新进行了视频编码及构建。
- 第一轮 21/21 通过（`phase9-online.log`）：其中 20 项访问公网，1 项为本地作品索引完整性检查。覆盖六种视口、键盘与导航、中文资源、动图/视频、库伦与三个 APP，以及《小王子》、造型基础等旧版详情。
- 第二轮 9/9 公网检查通过（`phase9-online-return.log`）：旧版返回后恢复图谱展开与选中作品、经历卡片及滚动位置，获奖证书，四种宽度的作品深链刷新/后退，手机分层浏览与时间轴定位。
- 对本地服务测试的重定向断言作兼容调整：允许标准 301/302/307/308，并校验解析后的目标路径。GitHub Pages 与本地服务可使用不同重定向状态。
- 未更改页面功能；保留旧版根入口。PHASE 9 发布与上述范围的公网验收完成。

边界：自动化浏览器视口不代表物理设备验收；PHASE 8 记录的 Firefox 本机启动问题和首屏长任务仍存在，不宣称所有设备完全无卡顿。后续修改源码需重新运行 Pages 工作流才会更新线上。
