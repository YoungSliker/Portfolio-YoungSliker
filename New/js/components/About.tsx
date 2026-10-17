import { categories } from '../../data/content';
import { SectionHeading } from './SectionHeading';

export function About() {
  return <section id="about" className="section about" aria-label="关于我">
    <SectionHeading number="02" label="ABOUT ME">HELLO, I'M<br /><span className="accent">YOUNGSLIKER.</span></SectionHeading>
    <div className="about-intro"><span className="small-label">想法，从交汇处发生。</span><p>我关注 AIGC、数字体验与视觉传播之间的交汇，通过生成式工具、创意编程、动态视觉和交互设计探索新的表达方式。</p></div>
    <div className="discipline-list">{categories.map(category => <article key={category.id} className="discipline"><span className="mono">{category.number}</span><div><h3>{category.title}</h3><p>{category.label}</p></div><p>{category.description}</p><span className="discipline-mark" aria-hidden="true">↗</span></article>)}</div>
  </section>;
}
