import { lazy, Suspense, useEffect, useRef, useState } from 'react';
const FluidGlass=lazy(()=>import('./FluidGlass'));
import '../../css/glass-title.css';

export function GlassTitle() {
  const title = useRef(null);
  const [fontSize, setFontSize] = useState(100);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const update = () => { setFontSize(parseFloat(getComputedStyle(title.current).fontSize)); setCompact(window.innerWidth <= 600); };
    const observer = new ResizeObserver(update);
    observer.observe(title.current); update();
    return () => observer.disconnect();
  }, []);
  const [reduced, setReduced] = useState(false);
  const [fontReady, setFontReady] = useState(false);
  useEffect(() => {
    let active = true;
    document.fonts.load('400 100px "PortfolioTitle"', '设计作品集').then(() => {
      if (active) setFontReady(true);
    }).catch(() => { if (active) setFontReady(true); });
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update(); media.addEventListener('change', update);
    return () => { active = false; media.removeEventListener('change', update); };
  }, []);
  return <div className="hero-glass-title">
    <h1 ref={title} id="hero-title">设计作品集</h1>
    {fontReady && !reduced && <div className="hero-glass-title__effect" aria-hidden="true"><Suspense fallback={null}>
      <FluidGlass text="设计作品集" fontFamily="PortfolioTitle, Microsoft YaHei, sans-serif"
        fontWeight={400} fontSize={fontSize} textColor="#111111" shape="blob" size={compact ? 68 : 190}
        interaction="follow" refraction={compact ? .25 : .85} dispersion={compact ? .18 : .85} reflection={compact ? .3 : .75}
        shadow={0} elevation={.25} wobble={compact ? .15 : .4} morphOnClick={false}
        maxDevicePixelRatio={1} intro={false} />
    </Suspense></div>}
  </div>;
}
