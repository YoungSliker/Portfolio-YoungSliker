import {useRef,useState} from 'react';
import {journeyEntries,journeyYears} from '../../data/journey';
import {useJourney} from '../hooks/useJourney';
import '../../css/journey.css';

export function Journey() {
  const root=useRef<HTMLElement>(null);
  const active=useJourney(root);
  const [overview,setOverview]=useState<string|null>(null);
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
        <div className="journey-meta"><span>{entry.date}</span><span>{entry.kind}</span></div>
        <h3>{entry.title}</h3><p className="journey-organization">{entry.organization}</p>
        <p className="journey-description">{entry.description}</p>
        <ul className="journey-tags">{entry.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>
        {!entry.confirmed&&<p className="journey-review">计划书记录 · 日期与职责待核对</p>}
        {entry.id!=='education'&&entry.kind!=='获奖'&&<button className="journey-work-link" aria-expanded={overview===entry.id} aria-controls={`overview-${entry.id}`} onClick={()=>setOverview(overview===entry.id?null:entry.id)}>查看「{entry.id==='internship'?'脸谱心智':entry.title}」作品概况 <span aria-hidden="true">{overview===entry.id?'−':'＋'}</span></button>}
        {overview===entry.id&&<section id={`overview-${entry.id}`} className="journey-overview" aria-label={`${entry.title}概况`}>
          <span className="journey-nav-label">PROJECT / 概况</span><h4>{entry.id==='internship'?'脸谱心智 · AIGC 实习':entry.title}</h4>
          <p>{entry.description}</p><p className="journey-overview-meta">{entry.organization} · {entry.date}</p>
        </section>}

      </article>)}</div>
    </div>
    <a className="journey-next" href="#works"><span>探索汇成作品</span><span>04 / WORKS ↗</span></a>
  </section>;
}
