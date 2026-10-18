# 首页加载动画

2026-10-18：删除完整点阵开场，现仅保留黑底白色圆点放大揭幕，约 1.4 秒自动进入首页，邮票错峰入场继续保留。

已移除流星、巨人、地球、圆弧、原子和 CursorGrid 组件及对应运行代码，无 Canvas/WebGL 开场开销。

白点从屏幕中央扩大，对齐首页圆环后揭开页面。此为短入场过渡，不显示虚构加载进度；不依赖滚轮、不锁定滚动。返回顶部不重播，减少动态效果设置下直接进入首页。

实现：js/components/LoadingIntro.tsx、css/loading-intro.css、js/hooks/useHeroMotion.ts。
验证：js/tests/intro.spec.ts 覆盖桌面、手机、横屏的白点扩大、自动完成、导航及减少动态效果；其余原有交互测试继续沿用。
