import { useRef } from 'react';
import { useHeroMotion } from '../hooks/useHeroMotion';
import { ArtworkTicket } from './ArtworkTicket';
import { LoadingIntro } from './LoadingIntro';
import '../../css/loading-intro.css';

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
  { id:'suiyuan', title:'绥远方志', description:'基于人智混合的呼和浩特史体验场景设计', date:'202507', image:cover('绥远方志.jpg') },
  { ...randomWork, description:'随机作品档案，扫码进入当前作品入口', date:'RANDOM' },
  { id:'mine', title:'矿山*生态', description:'基于Depth Ai场景建模的Ue5实机演示', date:'202308', image:cover('矿山生态.jpg') },
  { id:'weiyuan', title:'微元灵溯', description:'基于“隐性饥饿”的AI艺术可视化交互设计', date:'202406', image:cover('微元灵溯.jpg') },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  useHeroMotion(root);
  const enter = () => {
    const el = root.current;
    if (!el) return;
    el.dispatchEvent(new Event('intro:skip'));
  };
  return <section ref={root} id="hero" className="hero" aria-labelledby="hero-title">
    <div className="hero-stage">
      <LoadingIntro onEnter={enter} />
      <div className="intro-aperture" aria-hidden="true" />
      <div className="hero-landing">
      <div className="hero-meta"><span>CREATIVE ARCHIVE / 翟杨阳</span><span>AI · DESIGN · INTERACTION</span></div>
      <div className="hero-orbit" aria-hidden="true"><i /><span>+</span></div>
      <div className="hero-title-group">
        <p className="hero-kicker">IDEAS IN MOTION. WORLDS IN THE MAKING.</p>
        <h1 id="hero-title">YOUNGSLIKER<span>®</span></h1>
      </div>
      <div className="hero-artworks">{artworks.map((artwork,index) =>
        <div className={`hero-card hero-card--${index+1}`} key={artwork.id}>
          <ArtworkTicket title={artwork.title} description={artwork.description} date={artwork.date}
            image={artwork.image} qrValue={`${location.origin}${import.meta.env.BASE_URL}#work=${artwork.id}`}
            width={index === 1 ? 280 : 360} height={index === 1 ? 360 : 280} />
        </div>)}</div>
      <div className="hero-description"><span className="hero-rule" /><p>探索人工智能、数字体验<br className="mobile-break" />与视觉传播的边界。</p><span>AI × CREATIVE × INTERACTION</span></div>
      <a href="#about" className="scroll-cue" aria-label="向下滚动，进入创作档案">
        <span className="cue-track" aria-hidden="true"><span className="cue-comet" /></span>
        <span className="cue-label">SCROLL TO DISCOVER</span><span className="cue-chinese">向下滚动，进入创作档案</span>
      </a>
      </div>
    </div>
  </section>;
}

