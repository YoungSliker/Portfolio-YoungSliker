import { sections, type SectionId } from '../../data/content';

export function Header({ active }: { active: SectionId }) {
  return <header className="site-header">
    <a className="brand" href="#hero" aria-label="YoungSliker 返回封面">YOUNGSLIKER<span aria-hidden="true">®</span></a>
    <nav aria-label="章节导航">
      {sections.filter(section => section.id !== 'hero' && section.id !== 'showcase').map(section =>
        <a key={section.id} href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>
          {section.en}<span className="nav-cn">{section.label}</span>
        </a>)}
    </nav>
    <span className="edition">PORTFOLIO / 2.0</span>
  </header>;
}
