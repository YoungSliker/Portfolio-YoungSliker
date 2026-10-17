# 首页点阵开场

需求：点阵人物扛球，滚动使球滚落、放大，中心亮点扩展至原首页圆环后揭示首页与邮票；导航从 About 开始出现，底栏透明融合。

参考：用户提供的 https://21st.dev/@larsen66/components/hero-ascii-one 及附件。
原场景 ID：OMzqyUv6M3kSnv0JeAtC（Unicorn Studio）。
人物素材来源：https://assets.unicorn.studio/images/a8Fr9xzwFTV1JTePmO0X7a8sxnk2/1aa.png
素材原样存于 assets/images/intro/atlas-source.png，运行时采样成点阵。

原粘贴代码是外部 WebGL 场景的嵌入，未公开可直接调用的独立球体滚动接口。
本版沿用原人物素材，使用本地 Canvas 重绘点阵球体和星空；并非原 Unicorn shader 的逐像素复刻。
不依赖在线场景运行，不安装 Tailwind/shadcn 或额外依赖，不采用附件里的水印 DOM 清理定时器。

useHeroMotion 管理一条可逆滚动轨道：
- 0–0.19：球从肩头滚落到中心。
- 0.19–0.40：球体继续放大。
- 0.40–0.58：中心亮点扩展，终点精确读取 .hero-orbit 的中心和半径。
- 0.58–0.78：圆形揭幕扩展到屏幕，标题出现。
- 0.64–0.835：四张邮票错峰入场。
- 0.835–1：保留首页阅读时间，然后进入 About。

减少动态效果时直接呈现静态作品集首页；跳转章节和键盘跳过入口始终可用。
Canvas 帧率上限约 30fps，DPR 上限 1.5；离开开场后停止绘制，组件卸载取消 RAF 和监听。
