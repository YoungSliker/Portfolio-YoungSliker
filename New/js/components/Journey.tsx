import {useEffect,useRef,useState} from 'react';
import {journeyEntries,journeyYears} from '../../data/journey';
import {useJourney} from '../hooks/useJourney';
import {InteractiveCursor} from './InteractiveCursor';
import {legacyAsset} from '../lib/assets';
import '../../css/journey.css';
import awardImage from '../../assets/images/03 The Journey/亚洲大创一等奖.jpg';
import silverImage from '../../assets/images/03 The Journey/“互联网+”大学生创新创业大赛省银.jpg';

const journeyImages=import.meta.glob('../../assets/images/03 The Journey/thumbnails/**/*.webp',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const imageFrom=(key:string)=>Object.entries(journeyImages).find(([path])=>path.includes(`/thumbnails/${key}`))?.[1];
const overviewCopy:Record<string,string>={
  education:'数字媒体艺术专业，围绕用户体验、影像创作与数字动态表达建立完整的设计基础。',
  mine:'以 Depth AI 建立场景模型，并在 UE5 中完成生态重建主题的实机演示。',
  arti:'围绕 ARTI 平台与人工智能艺术教育，将图像生成方法拆解为四个可观看的教程。',
  lingsu:'与精灵相遇，在探索中认识维生素；让看不见的营养知识成为可探索、可互动的体验。',
  internship:'配置和优化 ComfyUI 的 LivePortrait、easyanimat；完善角色卡与抽卡动画；制作 CP30 宣发物料并参与模拟器设计与 PyQt 界面开发。',
  earthquake:'制作系列视频，传播活动断层探测成果的应用及减轻地震灾害损失的知识。',
  suiyuan:'以呼和浩特史志为内容，使用 AIGC、Unity 与 VR 构建沉浸式交互体验。'
};
const graphEntryIds:Record<string,string>={mine:'mine-eco',arti:'ai-extra-6',lingsu:'weiyuan',earthquake:'ai-extra-9',suiyuan:'suiyuan'};
const overviewImages:Record<string,string[]>= {
  education:['数媒/师大标志(左右组合)'],
  arti:['ARTI/0091','ARTI/0092'], lingsu:['微元灵溯LOGO'], internship:['FaceMindLogo'],
  earthquake:['小马博士/0069','小马博士/0070'], suiyuan:['绥远方志/0031','绥远方志/0034']
};

export function Journey() {
  const root=useRef<HTMLElement>(null);
  const active=useJourney(root);
  const [overview,setOverview]=useState<string|null>(null);
  const [suiyuanImages,setSuiyuanImages]=useState<string[]>([]);
  const rememberPosition=(id:string)=>{
    sessionStorage.setItem('portfolio-journey-return',JSON.stringify({id,offset:document.getElementById(`journey-${id}`)?.getBoundingClientRect().top??0,images:suiyuanImages}));
  };
  useEffect(()=>{
    if(!new URLSearchParams(location.search).has('journeyReturn'))return;
    let cancelled=false;
    try{
      const saved=JSON.parse(sessionStorage.getItem('portfolio-journey-return')||'null');
      if(!saved||!journeyEntries.some(entry=>entry.id===saved.id))return;
      setOverview(saved.id);setSuiyuanImages(saved.images||[]);
      void document.fonts.ready.then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
        if(cancelled)return;
        const entry=document.getElementById(`journey-${saved.id}`);
        if(entry)window.scrollTo({top:scrollY+entry.getBoundingClientRect().top-saved.offset,behavior:'instant'});
        const url=new URL(location.href);url.searchParams.delete('journeyReturn');history.replaceState(null,'',url);
      })));
    }catch{/* A missing saved position falls back to the Journey section. */}
    return()=>{cancelled=true;};
  },[]);
  const toggleOverview=(id:string)=>{
    if(id==='suiyuan'&&overview!==id){
      const pool=Object.keys(journeyImages).filter(path=>path.includes('/绥远方志/')).map(path=>path.split('/thumbnails/')[1]);
      for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
      let next=pool.slice(0,2);
      if(next.every(item=>suiyuanImages.includes(item))&&pool.length>2)next=[pool[2],pool[0]];
      setSuiyuanImages(next);
    }
    setOverview(overview===id?null:id);
  };
  const lightbox=useRef<HTMLDialogElement>(null);
  const [imageOpen,setImageOpen]=useState(false);
  const [activeCertificate,setActiveCertificate]=useState('award-1');
  const certificateTitle=activeCertificate==='award-0'?'“互联网+”省银获奖证书':'亚洲大学生创意设计展一等奖证书';
  useEffect(()=>{
    if(!imageOpen)return;
    const dialog=lightbox.current!;const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';dialog.showModal();
    return()=>{dialog.close();document.body.style.overflow=previous;};
  },[imageOpen]);
  const goToYear=(year:string)=>{
    const entry=journeyEntries.find(item=>item.year===year)!;
    document.getElementById(`journey-${entry.id}`)?.scrollIntoView({block:'start',behavior:'instant'});
  };
  return <section ref={root} id="journey" className="section journey" aria-labelledby="journey-title">
    <div className="journey-heading"><p className="eyebrow"><span>03 /</span> THE JOURNEY</p><h2 id="journey-title">每一步，<br/><span>都是新的视角。</span></h2></div>
    <div className="journey-layout">
      <aside className="journey-sidebar">
        <p className="journey-nav-label">YEARS / 年份导航</p>
        <nav aria-label="经历年份">{journeyYears.map(year=><button key={year} type="button" aria-current={journeyEntries[active].year===year?'step':undefined} onClick={()=>goToYear(year)}><span>{year}</span><small>{String(journeyEntries.filter(item=>item.year===year).length).padStart(2,'0')}</small></button>)}</nav>
        <p className="journey-position">{String(active+1).padStart(2,'0')} <span>/ {String(journeyEntries.length).padStart(2,'0')} RECORDS</span></p>
      </aside>
      <div className="journey-records">{journeyEntries.map((entry,index)=><article tabIndex={-1} key={entry.id} id={`journey-${entry.id}`} className={`journey-entry journey-entry--${entry.id}`} data-timeline-entry data-current={active===index} data-past={active>index} aria-current={active===index?'step':undefined}>
        <span className="journey-node" aria-hidden="true"/>
        <div className="journey-entry-copy"><div className="journey-meta"><span>{entry.date}</span><span>{entry.kind}</span></div>
        <h3>{entry.title}</h3><p className="journey-organization">{entry.id==='award-1'?'2024第一届亚洲大学生创意设计展':entry.organization}</p>
        <p className="journey-description">{entry.description}</p>
        <ul className="journey-tags">{entry.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>
        {!entry.confirmed&&<p className="journey-review">计划书记录 · 日期与职责待核对</p>}
        <button className="journey-work-link" aria-expanded={overview===entry.id} aria-controls={`overview-${entry.id}`} onClick={()=>toggleOverview(entry.id)}>查看「{entry.id==='internship'?'实习经历':entry.title}」概况 <span aria-hidden="true">{overview===entry.id?'−':'＋'}</span></button>
        </div>
        {overview===entry.id&&<section id={`overview-${entry.id}`} className="journey-overview" aria-label={`${entry.title}概况`}>
          {['mine','arti','lingsu','earthquake','suiyuan'].includes(entry.id)&&<a className="journey-detail-link" href={`${legacyAsset('index.html',import.meta.env.BASE_URL)}?work=${entry.id}`} onClick={()=>rememberPosition(entry.id)}>查看作品详情 ↗</a>}
          {entry.kind==='获奖'?<button type="button" className="journey-certificate" onClick={()=>{setActiveCertificate(entry.id);setImageOpen(true);}} aria-label={`放大${entry.title}证书`}><span>点击查看大图</span><div data-cursor-bound className={`certificate-image${entry.id==='award-0'?' certificate-image--rotate':''}`}><img src={imageFrom(entry.id==='award-0'?'“互联网+”大学生创新创业大赛省银':'亚洲大创一等奖')} alt={`${entry.title}证书`}/></div></button>:<>
            <span className="journey-nav-label">{entry.id==='internship'?'INTERNSHIP / 实习经历':'PROJECT / 概况'}</span>
            <h4>{entry.id==='internship'?'AIGC 实习 · 工作内容':entry.id==='earthquake'?'活动断层成果应用':entry.title}</h4>
            {entry.id==='internship'?<ul className="journey-internship-list"><li>配置和优化 ComfyUI 的 LivePortrait、easyanimat。</li><li>完善和修改角色卡，制作抽卡抽奖动画及类 fufu 的角色 AI 动画。</li><li>制作 CP30 宣发海报、易拉宝，完善哄哄模拟器设计，迭代话题与话术。</li><li>完善 VUP 模拟器设计，使用 PyQt 编写界面。</li></ul>:<p>{overviewCopy[entry.id]??entry.description}</p>}
            {overviewImages[entry.id]&&<div className={`journey-overview-images journey-overview-images--${entry.id}`}>{(entry.id==='suiyuan'?suiyuanImages:overviewImages[entry.id]).map((key,index)=>{const src=imageFrom(key);return src?<img key={key} src={src} alt={`${entry.title}展示 ${index+1}`} loading="lazy" decoding="async"/>:null;})}</div>}
            <p className="journey-overview-meta">{entry.organization} · {entry.date}</p>{graphEntryIds[entry.id]&&<a className="journey-graph-link" href={`#work=${graphEntryIds[entry.id]}`}>在图谱中定位 ↗</a>}
          </>}
        </section>}

      </article>)}</div>
    </div>
    <dialog ref={lightbox} className="journey-lightbox" aria-label={`${certificateTitle}大图`} onClose={()=>setImageOpen(false)} onClick={event=>{if(event.target===event.currentTarget)setImageOpen(false);}}>
      {imageOpen&&<InteractiveCursor/>}
      <button type="button" className="journey-lightbox-close" aria-label="关闭证书大图" onClick={()=>setImageOpen(false)}>关闭 ×</button>
      <img className={activeCertificate==='award-0'?'certificate-full--rotate':undefined} src={activeCertificate==='award-0'?silverImage:awardImage} alt={`${certificateTitle}大图`}/>
    </dialog>
    <a className="journey-next" href="#works"><span>探索汇成作品</span><span>04 / WORKS ↗</span></a>
  </section>;
}
