import {useEffect,useRef,useState} from 'react';
import {journeyEntries,journeyYears} from '../../data/journey';
import {useJourney} from '../hooks/useJourney';
import '../../css/journey.css';
import awardImage from '../../assets/images/03 The Journey/亚洲大创一等奖.jpg';

export function Journey() {
  const root=useRef<HTMLElement>(null);
  const active=useJourney(root);
  const [overview,setOverview]=useState<string|null>(null);
  const lightbox=useRef<HTMLDialogElement>(null);
  const [imageOpen,setImageOpen]=useState(false);
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
        <div className="journey-mini-track" aria-hidden="true"><i/></div>
      </aside>
      <div className="journey-records">{journeyEntries.map((entry,index)=><article tabIndex={-1} key={entry.id} id={`journey-${entry.id}`} className="journey-entry" data-timeline-entry data-current={active===index} data-past={active>index} aria-current={active===index?'step':undefined}>
        <span className="journey-node" aria-hidden="true"/>
        <div className="journey-entry-copy"><div className="journey-meta"><span>{entry.date}</span><span>{entry.kind}</span></div>
        <h3>{entry.title}</h3><p className="journey-organization">{entry.organization}</p>
        <p className="journey-description">{entry.description}</p>
        <ul className="journey-tags">{entry.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>
        {!entry.confirmed&&<p className="journey-review">计划书记录 · 日期与职责待核对</p>}
        {entry.id!=='education'&&(entry.kind!=='获奖'||entry.id==='award-1')&&<button className="journey-work-link" aria-expanded={overview===entry.id} aria-controls={`overview-${entry.id}`} onClick={()=>setOverview(overview===entry.id?null:entry.id)}>查看「{entry.id==='internship'?'脸谱心智':entry.title}」作品概况 <span aria-hidden="true">{overview===entry.id?'−':'＋'}</span></button>}
        </div>
        {overview===entry.id&&<section id={`overview-${entry.id}`} className="journey-overview" aria-label={`${entry.title}概况`}>
          <span className="journey-nav-label">PROJECT / 概况</span><h4>{entry.id==='internship'?'脸谱心智 · AIGC 实习':entry.title}</h4>
          {entry.id==='award-1'?<button type="button" className="journey-certificate" onClick={()=>setImageOpen(true)} aria-label="放大亚洲大学生创意设计展一等奖证书"><img src={awardImage} alt="亚洲大学生创意设计展一等奖证书"/><span>点击查看大图 ↗</span></button>:<p>{entry.description}</p>}<p className="journey-overview-meta">{entry.organization} · {entry.date}</p>
        </section>}

      </article>)}</div>
    </div>
    <dialog ref={lightbox} className="journey-lightbox" aria-label="亚洲大学生创意设计展一等奖证书大图" onClose={()=>setImageOpen(false)} onClick={event=>{if(event.target===event.currentTarget)setImageOpen(false);}}>
      <button type="button" className="journey-lightbox-close" aria-label="关闭证书大图" onClick={()=>setImageOpen(false)}>关闭 ×</button>
      <img src={awardImage} alt="亚洲大学生创意设计展一等奖证书大图"/>
    </dialog>
    <a className="journey-next" href="#works"><span>探索汇成作品</span><span>04 / WORKS ↗</span></a>
  </section>;
}
