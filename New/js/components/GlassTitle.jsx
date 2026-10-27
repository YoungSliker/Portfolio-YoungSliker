import FoldText from './FoldText';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
const FluidGlass = lazy(() => import('./FluidGlass'));
import '../../css/glass-title.css';

export function GlassTitle() {
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [glass, setGlass] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [size, setSize] = useState({ font:100, compact:false });
  useEffect(() => {
    const update = () => setSize({font:parseFloat(getComputedStyle(host.current.querySelector('h1')).fontSize),compact:innerWidth<=600});
    const observer = new ResizeObserver(update);
    observer.observe(host.current); update();
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const preference = () => setReduced(media.matches);
    preference();media.addEventListener('change',preference);
    return () => {observer.disconnect();media.removeEventListener('change',preference);};
  }, []);
  useEffect(() => {
    if (!ready || reduced) return;
    const timer = setTimeout(() => setGlass(true), 1500);
    return () => clearTimeout(timer);
  }, [ready,reduced]);
  useEffect(() => {
    const hero = host.current.closest('.hero');
    let active = true, fontReady = false;
    const reveal = () => { if (active && fontReady && Number(hero?.dataset.progress)>=.62) setReady(true); };
    const observer = new MutationObserver(reveal);
    if (hero) observer.observe(hero, { attributes:true, attributeFilter:['data-progress'] });
    document.fonts.load('400 100px "PortfolioTitle"', '设计作品集').finally(() => { if (!active) return; fontReady = true; setFontLoaded(true); reveal(); });
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <div ref={host} className="hero-glass-title hero-fold-title" data-title-ready={ready} data-fold-complete={glass} data-glass-active={ready && !reduced ? 'true' : 'false'}><h1 id="hero-title">
    {ready ? <FoldText text="设计作品集" foldStyle="blinds" splitBy="char" hinge="top"
      trigger="mount" foldAngle={90} duration={1.1} stagger={.08} staggerFrom="center"
      ease="expo.out" hoverRefold={false} refoldRadius={100} refoldAngle={60}
      perspective={500} creaseShading={.8} fontSize="inherit" fontWeight={400}/> : '设计作品集'}
  </h1>
    {fontLoaded && !reduced && <div className="hero-glass-title__effect" aria-hidden="true"><Suspense fallback={null}>
      <FluidGlass text={glass ? '设计作品集' : ''} fontFamily="PortfolioTitle, Microsoft YaHei, sans-serif"
        fontWeight={400} fontSize={size.font} textColor="#111111" shape="blob" size={size.compact?68:190}
        interaction="follow" refraction={size.compact?.25:.85} dispersion={size.compact?.18:.85} reflection={size.compact?.3:.75}
        shadow={0} elevation={.25} wobble={size.compact?.15:.4} morphOnClick={false}
        maxDevicePixelRatio={1} intro={false}/>
    </Suspense></div>}
  </div>;
}
