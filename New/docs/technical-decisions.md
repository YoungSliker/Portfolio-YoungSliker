# PHASE 0 — 技术决策与实施边界

依据用户提供的 `New/文档.md`，按 AUDIT → FOUNDATION → HERO → JOURNEY → GRAPH PROTOTYPE → CONTENT → SCROLL INTEGRATION → RESPONSIVE → VIDEO → QA 推进。本轮完成 AUDIT 文档和数据，不开发后续阶段页面。

## 已确定

- 新版独立位于 `New`；继续使用当前本地仓库，旧站根目录不覆盖。
- React + TypeScript + Vite；GSAP ScrollTrigger 负责关键滚动动画；图谱阶段首选 React Flow，先验证再全量接入。
- 原生纵向滚动；HyperFrames、Remotion、Three.js、Lenis 都不默认添加。
- `js/` 同时收纳 `.js/.ts/.tsx`，样式全部在 `css/`，Python 工具在 `py/`，结构化内容在 `data/`。遵循用户分类要求，调整计划书中的推荐目录。
- 根 `.gitignore` 的 `src/` 会匹配 `New/src/`，已通过 Git 检查确认。采用 `New/js/` 避开该规则。
- `New` 使用自己的依赖清单与锁文件，避免改变旧站根依赖。只在对应开发阶段安装所需依赖。

## 现有开发条件

本机可用 Node v24.19.0、npm 11.17.0、Python 3.14.7。根依赖清单声明 React、Vite、GSAP、Playwright 等，但没有 scripts。尚未验证依赖安装状态和浏览器运行环境。

## 新版目录约定

```text
New/
  文档.md                 用户原始计划，保留原文
  index.html              PHASE 1 页面入口
  package.json            PHASE 1 独立依赖与命令
  vite.config.ts          构建工具配置（工具要求的根配置文件）
  tsconfig.json
  js/
    app/                  页面装配
    components/           六章节及复用组件
    hooks/                React 动画与交互钩子
    lib/                  URL、资源地址和兼容接口
    types/                项目与经历类型
    scripts/              JS 检查和录屏工具
    tests/                自动化测试
  css/                    变量、基础和各模块样式
  data/                   作品、分类、经历和审计数据
  py/                     Python 素材工具
  assets/images/
  assets/videos/
  assets/fonts/
  docs/                   审计、阶段计划及验收记录
```

上述未来目录不表示已实现。媒体继续引用原仓库，新增优化资源才存入 New。构建产物需在 New 内独立输出；新页面的静态部署也不得覆盖旧站入口。

## 路径和部署

预期并行预览地址为 `/Portfolio-YoungSliker/New/`，旧站仍在 `/Portfolio-YoungSliker/`。Vite 的 `base` 按实际部署子路径设置，不能误用站点根 `/`。开发和构建预览需共同提供旧媒体路径；不能仅靠开发服务器可访问就认定生产资源正常。[Vite 静态部署文档](https://vite.dev/guide/static-deploy.html)

采用集中资源地址函数处理旧媒体相对路径、中文名称和子路径。PHASE 1 验证至少一张旧图及旧站首页；PHASE 5 扩展到完整案例。部署实现留到相应阶段，不在审计阶段更改发布设置。

## 图谱原型范围（PHASE 4）

选取 12 个真实项目：三个重点 AIGC、蜀韵天下、Kinect 表情、Kinect 手势水、Leap 文物、学伴、颜茶阁、库伦荞麦、阿尔寨石窟寺、创意归绥。年份及职责未核实的字段显示待确认。

先做固定坐标、自定义节点与连线、三大领域、分支展开、聚焦、复位、缩放按钮和基础详情。用集中状态管理区分 story/explore，手机只渲染当前层级。

React Flow 配置重点为 `zoomOnScroll=false`、`panOnScroll=false`、`preventScrolling=false`，再验证触摸及拖动策略；单纯关闭缩放不等于滚轮一定能传给页面。禁用节点编辑，提供键盘及列表入口。[React Flow 交互 API](https://reactflow.dev/api-reference/react-flow)

必须验证：图谱上滚轮能继续阅读页面、手动探索不被滚动覆盖、关闭详情恢复焦点、退出探索恢复当前故事阶段、刷新布局稳定。通过原型后再接全部作品，不先引入 D3。

## 动画与测试策略

React 动画使用组件作用域与清理，防止重挂载后重复 ScrollTrigger；优先评估 `@gsap/react` 的生命周期管理。减少动态效果时内容仍完整可见。[GSAP React 官方指南](https://gsap.com/resources/React/)

PHASE 1 交付六章节、导航、设计变量、数据类型、旧站入口及启动/构建/检查命令。验收为类型检查、生产构建、真实浏览器滚动和导航，桌面/手机截图。后续覆盖 375、430、768、1024、1440、1920 宽度及横屏、减少动态效果、历史导航和部署子路径。

## 本阶段未做

未安装依赖、未开发页面、未运行网站构建或端到端测试、未制作视频、未提交或发布。官方文档仅核对核心 API 与部署约束；视觉参考站的实际动效研究留在封面和图谱阶段。
