import { useEffect, useRef } from 'react';
import { sections, type SectionId } from '../../data/content';
export function ScrollProgress({ active }: { active: SectionId }) {
  const track = useRef<HTMLSpanElement>(null);
  const index = Math.max(0, sections.findIndex(section => section.id === active));
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      track.current?.style.setProperty('--reading-progress', String(progress));
      track.current?.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    const observer = new ResizeObserver(update); observer.observe(document.body);
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="reading-footer" aria-label="页面阅读进度"><div className="reading-chapter">
    <span>{active === 'hero' ? 'DISCOVERY' : sections[index].en}</span>
    <span ref={track} className="reading-track" role="progressbar" aria-label="整页滚动进度" aria-valuemin={0} aria-valuemax={100}><i /></span>
    <span>{String(index + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</span>
    </div><span className="reading-note">SCROLL TO DISCOVER. CONNECT TO EXPLORE.</span></div>;
}
