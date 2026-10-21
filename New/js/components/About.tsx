import FlowingMenu from './FlowingMenu';
import { categories } from '../../data/content';
import { useRef, useState } from 'react';
import { useAboutMotion } from '../hooks/useAboutMotion';
import '../../css/about.css';

const details = [
  { words:['生成式视觉','AI 创作','数字叙事'], text:'从想法的生成，到场景的构建。探索人工智能如何参与视觉表达，让抽象的概念成为可以感知的画面。' },
  { words:['交互装置','新媒体艺术','用户体验'], text:'从观看走向参与。通过界面、空间与互动反馈，探索人与数字内容之间的关系。' },
  { words:['品牌识别','信息可视化','视觉系统'], text:'让信息拥有清晰的形态。在文字、图形与秩序之间，寻找有辨识度的视觉表达。' },
];

const fieldCovers=import.meta.glob('../../assets/images/graph/*.webp',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const fieldItems=categories.map((category,index)=>({text:category.label,marquee:details[index].words.join(' · '),image:fieldCovers[`../../assets/images/graph/${['suiyuan','shuyun','kulun'][index]}.webp`]}));

export function About() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  useAboutMotion(root);
  return <section ref={root} id="about" className="section about" aria-labelledby="about-title">
    <div className="about-portal">
    <div className="about-chapter"><p className="eyebrow"><span>02 /</span> ABOUT ME</p><span className="mono">IDEAS MEET POSSIBILITIES</span></div>
    <div className="about-lead">
      <div className="about-statement" data-about-reveal>
        <p className="about-signature">HELLO, I'M YOUNGSLIKER.</p>
        <h2 id="about-title">让<span className="accent">好奇心</span>，<br />成为作品。</h2>
        <span className="about-caption">AI × DESIGN × INTERACTION</span>
      </div>
      <div className="about-profile" data-about-reveal>
        <div className="about-intersection" data-field={active} aria-hidden="true"><i/><i/><i/><b>+</b><span>CONNECT / CREATE</span></div>
        <p className="about-name">翟杨阳 <span>YoungSliker</span></p>
        <p className="about-bio">我关注 <em>AIGC、数字体验与视觉传播</em>之间的交汇，通过生成式工具、创意编程、动态视觉和交互设计探索新的表达方式。</p>
        <a className="text-link" href="#works">浏览我的作品 <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    </div>
    <div className="about-fields-heading" data-about-reveal><span className="mono">THREE FIELDS / ONE PRACTICE</span><p>三种视角，共同构成我的创作。</p></div>
    <div className="about-flowing-fields">
      <FlowingMenu items={fieldItems} intro={false} speed={65} carryContent showArrow
        textColor="#171717" bgColor="#eeeae3" marqueeBgColor="#171717" marqueeTextColor="#faf9f6"
        borderColor="#d8d0c4" ariaLabel="创作领域" onItemClick={(_item:unknown,index:number)=>setActive(index)} />
    </div>
    <p className="about-field-summary" aria-live="polite">{details[active].text}</p>
    <a className="about-next" href="#journey"><span>继续了解我的经历</span><span className="mono">03 / JOURNEY ↓</span></a>
  </section>;
}
