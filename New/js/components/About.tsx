import { categories } from '../../data/content';
import { useRef, useState } from 'react';
import { useAboutMotion } from '../hooks/useAboutMotion';
import '../../css/about.css';

const details = [
  { words:['生成式视觉','AI 创作','数字叙事'], text:'从想法的生成，到场景的构建。探索人工智能如何参与视觉表达，让抽象的概念成为可以感知的画面。' },
  { words:['交互装置','新媒体艺术','用户体验'], text:'从观看走向参与。通过界面、空间与互动反馈，探索人与数字内容之间的关系。' },
  { words:['品牌识别','信息可视化','视觉系统'], text:'让信息拥有清晰的形态。在文字、图形与秩序之间，寻找有辨识度的视觉表达。' },
];

export function About() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useAboutMotion(root);
  return <section ref={root} id="about" className="section about" aria-labelledby="about-title">
    <div className="about-chapter"><p className="eyebrow"><span>02 /</span> ABOUT ME</p><span className="mono">IDEAS MEET POSSIBILITIES</span></div>
    <div className="about-lead">
      <div className="about-statement" data-about-reveal>
        <p className="about-signature">HELLO, I'M YOUNGSLIKER.</p>
        <h2 id="about-title">想法，<br />从<span className="accent">交汇处</span><br />发生。</h2>
        <span className="about-caption">AI × DESIGN × INTERACTION</span>
      </div>
      <div className="about-profile" data-about-reveal>
        <div className="about-intersection" data-field={active} aria-hidden="true"><i/><i/><i/><b>+</b><span>CONNECT / CREATE</span></div>
        <p className="about-name">翟杨阳 <span>YoungSliker</span></p>
        <p className="about-bio">我关注 <em>AIGC、数字体验与视觉传播</em>之间的交汇，通过生成式工具、创意编程、动态视觉和交互设计探索新的表达方式。</p>
        <a className="text-link" href="#works">浏览我的作品 <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <div className="about-fields-heading" data-about-reveal><span className="mono">THREE FIELDS / ONE PRACTICE</span><p>三种视角，共同构成我的创作。</p></div>
    <div className="about-fields">{categories.map((category, index) => <article key={category.id} className="about-field" data-active={active===index} data-about-reveal>
      <h3><button type="button" id={`field-${category.id}`} aria-expanded={active===index} aria-controls={`field-panel-${category.id}`} onClick={()=>setActive(index)}>
        <span className="about-field-number">{category.number}</span><span className="about-field-title">{category.label}<small>{category.title}</small></span><span className="about-field-toggle" aria-hidden="true">{active===index?'−':'+'}</span>
      </button></h3>
      <div id={`field-panel-${category.id}`} role="region" aria-labelledby={`field-${category.id}`} hidden={active!==index} className="about-field-body">
        <p>{details[index].text}</p><ul>{details[index].words.map(word=><li key={word}>{word}</li>)}</ul>
      </div>
    </article>)}</div>
    <a className="about-next" href="#journey"><span>继续了解我的经历</span><span className="mono">03 / JOURNEY ↓</span></a>
  </section>;
}
