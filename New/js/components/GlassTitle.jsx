import FoldText from './FoldText';
import { useEffect, useRef, useState } from 'react';
import '../../css/glass-title.css';

export function GlassTitle() {
  const host = useRef(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const landing = host.current.closest('.hero-landing');
    let active = true, fontReady = false;
    const reveal = () => { if (active && fontReady && !landing?.inert) setReady(true); };
    const observer = new MutationObserver(reveal);
    if (landing) observer.observe(landing, { attributes:true, attributeFilter:['inert'] });
    document.fonts.load('400 100px "PortfolioTitle"', '设计作品集').finally(() => { fontReady = true; reveal(); });
    return () => { active = false; observer.disconnect(); };
  }, []);
  return <div ref={host} className="hero-glass-title hero-fold-title"><h1 id="hero-title">
    {ready ? <FoldText text="设计作品集" foldStyle="blinds" splitBy="char" hinge="top"
      trigger="scroll" foldAngle={90} duration={1.1} stagger={.08} staggerFrom="center"
      ease="expo.out" hoverRefold refoldRadius={100} refoldAngle={60}
      perspective={500} creaseShading={.8} fontSize="inherit" fontWeight={400}/> : '设计作品集'}
  </h1></div>;
}
