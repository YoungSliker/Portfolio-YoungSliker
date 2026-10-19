import { useEffect, useState } from 'react';
import FluidGlass from './FluidGlass';
import '../../css/glass-title.css';

export function GlassTitle() {
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
    <h1 id="hero-title">设计作品集</h1>
    {fontReady && !reduced && <div className="hero-glass-title__effect" aria-hidden="true">
      <FluidGlass text="设计作品集" fontFamily="PortfolioTitle, Microsoft YaHei, sans-serif"
        fontWeight={400} textColor="#111111" shape="blob" size={190}
        interaction="follow" refraction={.85} dispersion={.18} reflection={.75}
        shadow={.18} elevation={.25} wobble={.4} morphOnClick={false}
        maxDevicePixelRatio={1.5} />
    </div>}
  </div>;
}
