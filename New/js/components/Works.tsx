import BlurText from './BlurText';
import { DraftingDetails } from './DraftingDetails';
import { legacyAsset } from '../lib/assets';
import { SectionHeading } from './SectionHeading';
import StrokeText from './StrokeText';
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
    <div className="works-heading"><DraftingDetails variant="works" /><SectionHeading number="04" label="CREATIVE UNIVERSE"><StrokeText text="IDEAS BECOME" strokeColor="currentColor" fontSize={90} fontWeight={900} letterSpacing={-5.85} trigger="scroll" /><span className="accent"><StrokeText text="EXPERIENCES." strokeColor="currentColor" fontSize={90} fontWeight={900} letterSpacing={-5.85} trigger="scroll" /></span></SectionHeading></div>
    <div ref={graphAnchor} style={{minHeight:600}}>{graphReady&&<Suspense fallback={<p role="status">正在展开作品图谱…</p>}><WorkGraph/></Suspense>}</div>
    <div className="works-footer"><p><BlurText text="点击图谱中的分类，展开作品。"/><br /><BlurText text="完整内容可继续浏览旧版作品集。"/></p><a className="text-link" href={legacyAsset('index.html', import.meta.env.BASE_URL)}>浏览旧版作品集 <span aria-hidden="true">↗</span></a></div>
  </section>;
}
