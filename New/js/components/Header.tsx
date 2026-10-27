import BlurText from './BlurText';
import { sections, type SectionId } from '../../data/content';
import { useEffect, useState } from 'react';

export function Header({ active }: { active: SectionId }) {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const update = () => setHidden((document.getElementById('about')?.getBoundingClientRect().top ?? Infinity) > parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 21);
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <header className="site-header" data-section={active} data-hidden={hidden} inert={hidden}>
    <a className="brand" href="#hero" aria-label="YoungSliker 返回封面"><BlurText text={'YOUNGSLIKER'}/><span aria-hidden="true">®</span></a>
    <nav aria-label="章节导航">
      {sections.filter(section => section.id !== 'hero').map(section =>
        <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>
          <BlurText text={section.en}/><span className="nav-cn"><BlurText text={section.label}/></span>
        </a>)}
    </nav>
    <span className="edition"><BlurText text={'PORTFOLIO / 2.0'}/></span>
  </header>;
}
