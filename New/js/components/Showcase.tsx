import { SectionHeading } from './SectionHeading';

export function Showcase() {
  return <section id="showcase" className="section showcase" aria-label="多设备展示">
    <SectionHeading number="05" label="ACROSS SCREENS">ONE CREATIVE UNIVERSE.<br />EVERY SCREEN.</SectionHeading>
    <div className="screen-formats" aria-label="计划支持的设备"><div><span>01</span><h3>DESKTOP</h3><p>完整视野，自由探索</p></div><div><span>02</span><h3>TABLET</h3><p>触摸之间，连接灵感</p></div><div><span>03</span><h3>MOBILE</h3><p>随时随地，继续阅读</p></div></div>
    <p className="showcase-note">三端演示视频将在网站交互完成后实录制作。当前展示的是响应式页面基础布局。</p>
  </section>;
}
