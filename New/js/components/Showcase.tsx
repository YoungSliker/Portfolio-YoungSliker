import BlurText from './BlurText';
import {lazy,Suspense,useRef,useState} from 'react';
const Player=lazy(()=>import('./WorkMedia').then(m=>({default:m.WorkMedia})));
const devices=[{id:'desktop',label:'DESKTOP',name:'桌面',size:'1440 × 900',text:'完整视野，随页浏览与自由探索。'},{id:'tablet',label:'TABLET',name:'平板',size:'1024 × 768',text:'连接经历与作品，在画布间继续探索。'},{id:'mobile',label:'MOBILE',name:'手机',size:'390 × 844',text:'逐层展开分类，轻松阅读作品概况。'}];
const covers=import.meta.glob('../../assets/images/showcase/*.webp',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const videos=import.meta.glob('../../assets/videos/showcase/*.mp4',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
export function Showcase(){
 const [active,setActive]=useState<string|null>(null);
 const returnFocus=useRef<string|null>(null);
 return <div id="showcase" className="showcase showcase--embedded" role="region" aria-label="多设备展示">
  <h3 className="experience-title"><BlurText text={'换个屏幕，也能自在浏览。'}/></h3>
  <div className="device-demos">{devices.map((d,i)=><article className={`device-demo device-demo--${d.id}`} key={d.id}>
   <div className="device-demo-heading"><span>0{i+1} / {d.size}</span><h3>{d.label}</h3><p>{d.text}</p></div>
   {active===d.id?<div className="device-demo-player"><Suspense fallback={<p role="status"><BlurText text={'正在载入演示…'}/></p>}><Player focusOnMount item={{src:'',type:'video'}} resolvedSrc={videos[`../../assets/videos/showcase/${d.id}.mp4`]} title={`${d.name}网页操作演示`}/></Suspense><button className="device-demo-close" onClick={()=>{returnFocus.current=d.id;setActive(null);}}><BlurText text={'收起演示 ×'}/></button></div>:<button ref={button=>{if(button&&returnFocus.current===d.id){button.focus({preventScroll:true});returnFocus.current=null;}}} className="device-demo-cover" aria-label={`观看${d.name}演示`} onClick={()=>setActive(d.id)}><img loading="lazy" decoding="async" src={covers[`../../assets/images/showcase/${d.id}.webp`]} alt={`${d.name}尺寸下的网站首页`} width={d.id==='desktop'?1440:d.id==='tablet'?1024:390} height={d.id==='desktop'?900:d.id==='tablet'?768:844}/><span><BlurText text={'观看演示 '}/><span aria-hidden="true">↗</span></span></button>}
  </article>)}</div>
  <p className="showcase-note"><BlurText text={'真实网页操作录制 · 三种屏幕尺寸模拟。展开视频后点击播放，体验从首页、经历到作品图谱的浏览过程。'}/></p>
 </div>;
}
