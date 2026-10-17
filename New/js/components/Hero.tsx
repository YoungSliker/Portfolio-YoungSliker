import { useRef } from 'react';
import { useHeroMotion } from '../hooks/useHeroMotion';
import TearTicket from './TearTicket';
const TearTicketAny = TearTicket as any;

const covers = import.meta.glob('../../assets/images/Top1-optimized/*.{jpg,jpeg,png,webp}', { eager: true, query: '?url', import: 'default' }) as Record<string,string>;
const cover = (file: string) => Object.entries(covers).find(([path]) => path.endsWith(`_${file}`))?.[1];
const randomWorks = Object.entries(covers)
  .filter(([path]) => !/_(绥远方志|矿山生态|微元灵溯)\.(jpg|jpeg|png|webp)$/i.test(path))
  .map(([path, image], index) => ({
    id: `random-${index}`,
    title: decodeURIComponent(path.split('/').pop() ?? '作品').replace(/\.[^.]+$/, '').replace(/^.*_/, ''),
    image,
  }));
// Stable for this page visit, including section navigation.
const randomWork = randomWorks[Math.floor(Math.random() * randomWorks.length)] ?? { id:'fallback', title:'创作选集', image:cover('库伦荞麦.png') };
const artworks = [
  { id:'suiyuan', title:'绥远方志', image:cover('绥远方志.jpg') }, randomWork,
  { id:'mine', title:'矿山*生态', image:cover('矿山生态.jpg') },
  { id:'weiyuan', title:'微元灵溯', image:cover('微元灵溯.jpg') },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useHeroMotion(root);
  return <section ref={root} id="hero" className="hero" aria-labelledby="hero-title">
    <div className="hero-stage">
      <div className="hero-meta"><span>CREATIVE ARCHIVE / 翟杨阳</span><span>AI · DESIGN · INTERACTION</span></div>
      <div className="hero-orbit" aria-hidden="true"><i /><span>+</span></div>
      <div className="hero-title-group">
        <p className="hero-kicker">IDEAS IN MOTION. WORLDS IN THE MAKING.</p>
        <h1 id="hero-title">YOUNGSLIKER<span>®</span></h1>
      </div>
      <div className="hero-artworks">{artworks.map((artwork,index) =>
        <div className={`hero-card hero-card--${index+1}`} key={artwork.id}>
          <TearTicketAny image={artwork.image} imageAlt={`${artwork.title}作品图像`}
            orientation={index === 1 ? 'vertical' : 'horizontal'}
            scrim
            width={index === 1 ? 250 : 300} height={index === 1 ? 310 : 210}
            stubSize={index === 1 ? 72 : 82} radius={8} holes={9} holeSize={5}
            rotate={0} tilt tiltMax={5} parallax={4}
            background="#f7f2e9" stubBackground="#fffaf3" color="#d94a1c"
            borderColor="#d94a1c" borderWidth={1} ariaLabel={`撕开${artwork.title}作品票根`}>
            <span className="ticket-title">{artwork.title}</span>
          </TearTicketAny>
          <span className="hero-card-number">0{index+1}</span>
        </div>)}</div>
      <div className="hero-description"><span className="hero-rule" /><p>探索人工智能、数字体验<br className="mobile-break" />与视觉传播的边界。</p><span>AI × CREATIVE × INTERACTION</span></div>
      <div className="hero-bridge" aria-hidden="true"><span>BEYOND A SINGLE MEDIUM</span><p>在 AI、设计与交互的<br /><em>交汇处。</em></p><span>继续向下，认识创作者 ↓</span></div>
      <a href="#about" className="scroll-cue" aria-label="向下滚动，进入创作档案">
        <span className="cue-track" aria-hidden="true"><span className="cue-comet" /></span>
        <span className="cue-label">SCROLL TO DISCOVER</span><span className="cue-chinese">向下滚动，进入创作档案</span>
      </a>
    </div>
  </section>;
}
