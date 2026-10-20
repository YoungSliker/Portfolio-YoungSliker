import { featuredWorks, categories } from '../../data/content';
import { legacyAsset } from '../lib/assets';
import { SectionHeading } from './SectionHeading';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
const WorkGraph=lazy(()=>import('./WorkGraph'));

export function Works() {
  const graphAnchor=useRef<HTMLDivElement>(null);
  const [graphReady,setGraphReady]=useState(false);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(e=>e.isIntersecting)){setGraphReady(true);observer.disconnect();}
    },{rootMargin:'500px'});
    if(graphAnchor.current)observer.observe(graphAnchor.current);
    return()=>observer.disconnect();
  },[]);
  return <section id="works" className="section works" aria-label="作品档案">
    <div className="works-heading"><SectionHeading number="04" label="CREATIVE UNIVERSE">IDEAS BECOME<br /><span className="accent">EXPERIENCES.</span></SectionHeading><p>三个设计领域，<br />彼此连接的创作实践。</p></div>
    <div ref={graphAnchor} style={{minHeight:600}}>{graphReady&&<Suspense fallback={<p role="status">正在展开作品图谱…</p>}><WorkGraph/></Suspense>}</div>
    <div className="work-grid">{featuredWorks.map((work, index) => <article className="work" id={`work-${work.id}`} tabIndex={-1} key={work.id}>
      <div className="work-image"><img src={legacyAsset(work.cover, import.meta.env.BASE_URL)} alt={`${work.title}作品封面`} loading="lazy" decoding="async" width="1600" height="1000" /><span className="work-number">0{index + 1}</span></div>
      <div className="work-title"><h3>{work.title}</h3><span>AIGC</span></div><p>{work.subcategory}</p><p className="work-date">完成时间待核对</p>
    </article>)}</div>
    <div className="works-footer"><div className="category-labels">{categories.map(c => <span key={c.id}>{c.number} / {c.label}</span>)}</div><p>先从十二件作品探索创作之间的联系。<br />完整内容可继续浏览旧版作品集。</p><a className="text-link" href={legacyAsset('index.html', import.meta.env.BASE_URL)}>浏览旧版作品集 <span aria-hidden="true">↗</span></a></div>
  </section>;
}
