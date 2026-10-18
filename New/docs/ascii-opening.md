# 首页点阵开场

需求：点阵人物扛球，滚动使球滚落并渐隐，留下的流星亮点扩展至原首页圆环后揭示首页与邮票；导航从 About 开始出现，底栏透明融合。

参考：用户提供的 https://21st.dev/@larsen66/components/hero-ascii-one 及附件。
原场景 ID：OMzqyUv6M3kSnv0JeAtC（Unicorn Studio）。
人物素材来源：https://assets.unicorn.studio/images/a8Fr9xzwFTV1JTePmO0X7a8sxnk2/1aa.png
素材原样存于 assets/images/intro/atlas-source.png，运行时采样成点阵。

原粘贴代码是外部 WebGL 场景的嵌入，未公开可直接调用的独立球体滚动接口。
本版沿用原人物素材，使用本地 Canvas 重绘点阵球体；并非原 Unicorn shader 的逐像素复刻。
背景接入用户提供的 React Bits CursorGrid JSX/CSS，保留鼠标区域高亮与点击波纹；离开开场后停用交互和绘制。
不依赖在线场景运行，不安装 Tailwind/shadcn 或额外依赖，不采用附件里的水印 DOM 清理定时器。

开场约 3.35 秒：黑幕流星从右上落到球顶亮点，尾迹淡出并留下亮点 → 人物与球 → YoungSliker Portfolio → CursorGrid 背景 → 向下滚动提示。提前滚动可跳过入场等待。
已移除顶部档案栏。

useHeroMotion 管理一条可逆滚动轨道：
- 0–0.26：球从肩头滚落到屏幕中央下方，球顶像素点对齐屏幕中心。
- 0.26–0.36：球保持原尺寸，逐渐淡出；流星亮点留在屏幕中心。
- 0.36–0.58：仅流星亮点放大，并衔接 .hero-orbit 的中心和半径。
- 球体与球面点阵不放大，渐隐只改变透明度。
- 已取消球体和亮点的模糊效果；反向滚动恢复球体及肩头位置。
- CursorGrid 网格透明度降至 0.14，区域填充 0.035，鼠标高亮上限 0.35，采用更暗的灰色与橙红色。
- 0.58–0.78：圆形揭幕扩展到屏幕，标题出现。
- 0.64–0.835：四张邮票错峰入场。
- 0.835–1：保留首页阅读时间，然后进入 About。

减少动态效果时直接呈现静态作品集首页；跳转章节和键盘跳过入口始终可用。
Canvas 帧率上限约 30fps，DPR 上限 1.5；离开开场后停止绘制，组件卸载取消 RAF 和监听。

