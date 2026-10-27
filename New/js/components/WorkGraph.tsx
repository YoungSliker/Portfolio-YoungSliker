import BlurText from './BlurText';
import { useGraphGrowth } from '../hooks/useGraphGrowth';
import { useEntrance } from '../hooks/useEntrance';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Background, Handle, Position, ReactFlow, useStore, type Edge, type Node, type NodeProps, type ReactFlowInstance } from '@xyflow/react';
import {useGraphStory} from '../hooks/useGraphStory';
import { useElasticGraph } from '../hooks/useElasticGraph';
import {journeyEntries} from '../../data/journey';
import { categories } from '../../data/content';
import { graphDetailKeys, graphGroups, graphWorks } from '../../data/graph';
import { legacyAsset } from '../lib/assets';
import { InteractiveCursor } from './InteractiveCursor';
import mediaCatalog from '../../data/work-media.json';
import {AppPreview} from './AppPreview';
import { WorkMedia, mediaUrl, type WorkMedium } from './WorkMedia';
import '@xyflow/react/dist/style.css';
import '../../css/work-graph.css';

type Point={x:number;y:number};
type ArchiveNode=Node<{label:string;eyebrow:string;kind:string;cover?:string;date?:string;active:boolean;choose:()=>void},'archive'>;
const anchors:Record<string,Point>={root:{x:0,y:0},aigc:{x:-360,y:-100},digital:{x:300,y:-250},visual:{x:300,y:280}};
const angles:Record<string,number>={aigc:Math.PI,digital:-Math.PI/3,visual:Math.PI/3};
for(const category of categories){
 const groups=graphGroups.filter(g=>g.category===category.id&&g.id!=='scenes');
 const direct=category.id==='aigc'?graphWorks.filter(w=>w.group==='scenes'):[];
 const children=[...direct,...groups];
 children.forEach((child,i)=>{const angle=angles[category.id]+(i-(children.length-1)/2)*.43; anchors[child.id]={x:anchors[category.id].x+Math.cos(angle)*360,y:anchors[category.id].y+Math.sin(angle)*360};});
 groups.forEach(g=>{const works=graphWorks.filter(w=>w.group===g.id);const radius=Math.max(200,works.length*30);works.forEach((w,i)=>{const angle=angles[category.id]+(i-(works.length-1)/2)*Math.min(.3,Math.PI*1.6/works.length);anchors[w.id]={x:anchors[g.id].x+Math.cos(angle)*radius,y:anchors[g.id].y+Math.sin(angle)*radius};});});
}
const previews=import.meta.glob('../../assets/images/graph/*.webp',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const preview=(id:string)=>previews[`../../assets/images/graph/${id}.webp`];
const categoryType:Record<string,{en:string;lead:string;title:string;note:string}>={
 'AIGC设计':{en:'GENERATIVE / ART',lead:'生成式创作',title:'AIGC',note:'人工智能 · 视觉表达'},
 '数字体验设计':{en:'DIGITAL / EXPERIENCE',lead:'人与数字',title:'体验设计',note:'交互 · 空间 · 界面'},
 '视觉传达设计':{en:'VISUAL / COMMUNICATION',lead:'图形与文字',title:'视觉传达',note:'品牌 · 信息 · 秩序'},
};
function ArchiveNodeView({data}:NodeProps<ArchiveNode>){
 const typography=categoryType[data.label];
 return <div className={`archive-node archive-node--${data.kind}`} data-active={data.active}>
  <Handle type="target" position={Position.Top}/><Handle type="source" position={Position.Bottom}/>
  <button onClick={data.choose} aria-label={data.label} aria-expanded={data.kind!=='work'?data.active:undefined}>
   <span className="archive-node-disc">{data.cover?<img src={data.cover} alt="" draggable={false}/>:data.kind==='category'&&typography?<span className="graph-type"><span className="graph-type-en"><BlurText stepDuration={.3} text={typography.en}/></span><i/><span className="graph-type-lead"><BlurText stepDuration={.3} text={typography.lead}/></span><b><BlurText stepDuration={.3} text={typography.title}/></b><span className="graph-type-note"><BlurText stepDuration={.3} text={typography.note}/></span></span>:<span>{data.kind==='root'?'我的作品':data.kind==='work'?'待加入':data.label}</span>}</span>
   {data.kind==='work'&&<strong><BlurText stepDuration={.3} text={data.label}/></strong>}
   {data.date&&<span className="graph-date-tail"><BlurText stepDuration={.3} text={data.date}/></span>}

  </button>
 </div>;
}
const nodeTypes={archive:memo(ArchiveNodeView)};
const nodeOrigin:[number,number]=[.5,.5];
const fitOptions={padding:.18,maxZoom:1};
const readZoom=(state:{transform:[number,number,number]})=>Math.round(state.transform[2]*100);
function ZoomReadout(){
 const zoom=useStore(readZoom);
 return <output className="graph-zoom-readout" aria-label="图谱缩放比例"><BlurText text={`${zoom}%`}/></output>;
}
// Pointer updates stay inside the canvas; unchanged nodes retain their data and callbacks.
const GraphCanvas=memo(function GraphCanvas({models,edges,resetVersion,onInit,onManual}:{
 models:ArchiveNode[];edges:Edge[];resetVersion:number;onInit:(flow:ReactFlowInstance<ArchiveNode>)=>void;onManual:()=>void;
}){
 const {nodes,onNodesChange,onNodeDragStart,onNodeDragStop}=useElasticGraph(models,edges,resetVersion);
 const growthRoot=useRef<HTMLDivElement>(null);
 useGraphGrowth(growthRoot);
 return <div ref={growthRoot} className="graph-canvas" aria-label="作品关系图">
  <ReactFlow<ArchiveNode> nodes={nodes} edges={edges} nodeTypes={nodeTypes} onInit={onInit} onNodesChange={onNodesChange} onNodeDragStart={(event,node)=>{onManual();onNodeDragStart(event,node);}} onMoveStart={event=>{if(event)onManual();}} onNodeDragStop={onNodeDragStop} nodeOrigin={nodeOrigin}
   fitView fitViewOptions={fitOptions} minZoom={.15} maxZoom={1.8} nodeDragThreshold={5} nodesDraggable nodesConnectable={false} elementsSelectable={false}
   zoomOnScroll={false} zoomOnDoubleClick={false} zoomOnPinch panOnScroll={false} preventScrolling={false} panOnDrag zoomActivationKeyCode={null}>
   <Background color="#c8bfae" gap={30} size={.7}/><ZoomReadout/>
  </ReactFlow>
 </div>;
});
type GraphReturn={expanded:string[];selected:string|null;category:string|null;group:string|null;positions:Record<string,Point>;viewport:{x:number;y:number;zoom:number};scrollY:number};
function readGraphReturn():GraphReturn|null{
 try{const token=new URLSearchParams(location.search).get('graphReturn');return token?JSON.parse(localStorage.getItem('graph-return:'+token)||'null'):null;}catch{return null;}
}
export default function WorkGraph(){
 const root=useRef<HTMLDivElement>(null),stage=useRef<HTMLDivElement>(null);
 useEntrance(root, '.graph-mobile-browser');
 const [story,setStory]=useState(()=>!readGraphReturn()&&!location.hash.startsWith('#work=')&&!new URLSearchParams(location.search).has('project')&&innerWidth>=768&&innerHeight>=650);
 const storyActive=useRef(story);
 const fitTimer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const stopStory=useCallback(()=>{
  if(!storyActive.current)return;
  storyActive.current=false;
  clearTimeout(fitTimer.current);
  const visibleTop=stage.current?.getBoundingClientRect().top??0;
  setStory(false);
  requestAnimationFrame(()=>{if(stage.current)window.scrollBy({top:stage.current.getBoundingClientRect().top-visibleTop,behavior:'instant'});});
 },[]);
 const enterStory=()=>{
  history.pushState(history.state,'');storyActive.current=true;setStory(true);
  setSelected(null);setGroup(null);
 };
 const storyStep=useCallback((index:number)=>{const id=categories[index].id;setCategory(id);setGroup(null);setSelected(null);setExpanded([id]);},[]);
 useGraphStory(story,root,stage,storyStep,stopStory);
 const [restored]=useState(readGraphReturn);
 const [linked]=useState(()=>graphWorks.find(w=>w.id===(location.hash.startsWith('#work=')?location.hash.slice(6):new URLSearchParams(location.search).get('project'))));
 const linkedGroup=graphGroups.find(g=>g.id===linked?.group);

 const restoreViewport=useRef(Boolean(restored));
 const [returnToken]=useState(()=>crypto.randomUUID());
 const [category,setCategory]=useState<string|null>(restored?.category??linkedGroup?.category??null);
 const [group,setGroup]=useState<string|null>(restored?.group??(linkedGroup?.id==='scenes'?null:linkedGroup?.id)??null);
 const [expanded,setExpanded]=useState<string[]>(restored?.expanded??(linkedGroup?[linkedGroup.category,...(linkedGroup.id==='scenes'?[]:[linkedGroup.id])]:[]));
 const [selected,setSelected]=useState<string|null>(restored?.selected??linked?.id??null);
 const [flow,setFlow]=useState<ReactFlowInstance<ArchiveNode>|null>(null);
 const [resetVersion,setResetVersion]=useState(0);
 const historySignature=useRef('');
 useEffect(()=>{
  const snapshot={expanded,selected,category,group};
  const signature=JSON.stringify(snapshot);
  if(historySignature.current===signature)return;
  const first=!historySignature.current;historySignature.current=signature;
  const next={...history.state,portfolioGraph:snapshot};
  const url=new URL(location.href);if(selected)url.searchParams.set('project',selected);else {url.searchParams.delete('project');if(url.hash.startsWith('#work='))url.hash='works';}
  if(first||storyActive.current)history.replaceState(next,'',url);else history.pushState(next,'',url);
 },[expanded,selected,category,group]);
 useEffect(()=>{
  const restore=(event:PopStateEvent)=>{
   stopStory();
   const snapshot=event.state?.portfolioGraph;if(!snapshot)return;
   historySignature.current=JSON.stringify(snapshot);
   setExpanded(snapshot.expanded);setSelected(snapshot.selected);setCategory(snapshot.category);setGroup(snapshot.group);
  };
  window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);
 },[stopStory]);
 useEffect(()=>{
  const locate=()=>{
   if(!location.hash.startsWith('#work='))return;
   stopStory();
   const item=graphWorks.find(w=>w.id===location.hash.slice(6));const parent=graphGroups.find(g=>g.id===item?.group);if(!item||!parent)return;
   const snapshot={expanded:[parent.category,...(parent.id==='scenes'?[]:[parent.id])],selected:item.id,category:parent.category,group:parent.id==='scenes'?null:parent.id};
   historySignature.current=JSON.stringify(snapshot);history.replaceState({...history.state,portfolioGraph:snapshot},'');
   setExpanded(snapshot.expanded);setSelected(item.id);setCategory(parent.category);setGroup(snapshot.group);
  };
  window.addEventListener('hashchange',locate);return()=>window.removeEventListener('hashchange',locate);
 },[stopStory]);
 const detail=useRef<HTMLDivElement>(null);
 const lightbox=useRef<HTMLDialogElement>(null);
 const [imageOpen,setImageOpen]=useState(false);
 const [mediaIndex,setMediaIndex]=useState(0);
 const returnButton=useRef<HTMLButtonElement|null>(null);
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const work=graphWorks.find(w=>w.id===selected);
 const confirmedEntry=journeyEntries.find(e=>e.workId===work?.id||e.id===({'ai-extra-6':'arti','ai-extra-9':'earthquake'} as Record<string,string>)[work?.id??'']);
 const media=work?(mediaCatalog as Record<string,WorkMedium[]>)[work.id]??[]:[];
 const imageWork=media.length>0&&!['logos','layout','apps'].includes(work?.group??'')&&!['ai-extra-2','ai-extra-5','ai-extra-7','ai-extra-10','ai-extra-12','ai-extra-14'].includes(work?.id??'');
 const videoGrid=['ai-extra-3','ai-extra-6'].includes(work?.id??'');
 const [linkStatus,setLinkStatus]=useState('');
 const copyLink=async()=>{const url=new URL(location.href);url.search='';url.searchParams.set('project',selected!);url.hash='works';try{await navigator.clipboard.writeText(url.href);setLinkStatus('链接已复制');}catch{setLinkStatus(url.href);}};
 const openPreview=()=>{setMediaIndex(0);setImageOpen(true);};
 useEffect(()=>{
  const dialog=lightbox.current;if(!imageOpen||!dialog)return;
  const previous=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();
  return()=>{dialog.close();document.body.style.overflow=previous;};
 },[imageOpen]);
 function reset(){stopStory();setCategory(null);setGroup(null);setSelected(null);setExpanded([]);setResetVersion(v=>v+1);}
 function showAll(){stopStory();setSelected(null);setExpanded(old=>old.length?[]:categories.map(c=>c.id));}
 function chooseCategory(id:string){stopStory();setCategory(id);setGroup(null);setSelected(null);setExpanded(old=>old.includes(id)?old.filter(x=>x!==id&&!graphGroups.some(g=>g.category===id&&g.id===x)):[...old,id]);}
 function chooseGroup(id:string){stopStory();setGroup(id);setSelected(null);setExpanded(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id]);}
 function chooseWork(id:string){stopStory();setLinkStatus('');returnButton.current=document.activeElement instanceof HTMLButtonElement?document.activeElement:null;setSelected(id);}
 function close(){setSelected(null);returnButton.current?.focus({preventScroll:true});if(innerWidth<768)returnButton.current?.scrollIntoView({block:'nearest',behavior:'instant'});}
 const visibleGroups=graphGroups.filter(g=>g.id!=='scenes'&&expanded.includes(g.category));
 const visibleWorks=graphWorks.filter(w=>expanded.includes(w.group==='scenes'?'aigc':w.group));
 const nodes:ArchiveNode[]=useMemo(()=>{
  const make=(id:string,label:string,eyebrow:string,kind:string,choose:()=>void,cover?:string):ArchiveNode=>({id,type:'archive',position:resetVersion===0?(restored?.positions[id]??anchors[id]):anchors[id],data:{label,eyebrow,kind,cover,date:graphWorks.find(w=>w.id===id)?.date,active:kind==='root'?expanded.length>0:kind==='work'?selected===id:expanded.includes(id),choose},focusable:false});
  return [make('root','我的作品','CREATIVE UNIVERSE','root',showAll),...categories.map(c=>make(c.id,c.label,c.number,'category',()=>chooseCategory(c.id))),...visibleGroups.map(g=>make(g.id,g.label,'','group',()=>chooseGroup(g.id))),...visibleWorks.map(w=>make(w.id,w.title,'','work',()=>chooseWork(w.id),preview(w.id)))];
 },[expanded,category,group,selected,flow]);
 const edges=useMemo(()=>[
  ...categories.map(c=>({id:`root-${c.id}`,source:'root',target:c.id})),
  ...visibleGroups.map(g=>({id:`${g.category}-${g.id}`,source:g.category,target:g.id})),
  ...visibleWorks.map(w=>({id:`${w.group}-${w.id}`,source:w.group==='scenes'?'aigc':w.group,target:w.id})),
  // Both projects are explicitly described as interactive experiences by the author.
  ...(expanded.includes('aigc')?['suiyuan','weiyuan'].map(id=>({id:`experience-${id}`,source:'digital',target:id})):[]),
 ].map(e=>({...e,type:'straight',style:{stroke:e.id.startsWith('experience')?'#d9b49b':'#b7aa99',strokeWidth:e.source==='root'?1.5:1,strokeDasharray:e.id.startsWith('experience')||e.source.startsWith('ai-')||e.target.startsWith('ai-')?'4 6':undefined},focusable:false})),[expanded]);
 function saveReturn(){
  if(!flow)return;
  try{localStorage.setItem('graph-return:'+returnToken,JSON.stringify({expanded,selected,category,group,positions:Object.fromEntries(flow.getNodes().map(n=>[n.id,n.position])),viewport:flow.getViewport(),scrollY:window.scrollY}));}catch{}
 }
 useEffect(()=>{if(!flow)return;if(restoreViewport.current&&restored){restoreViewport.current=false;const timer=setTimeout(()=>{void flow.setViewport(restored.viewport);window.scrollTo({top:restored.scrollY,behavior:'instant'});},100);return()=>clearTimeout(timer);}const timer=fitTimer.current=setTimeout(()=>void flow.fitView({nodes:story?nodes.filter(n=>n.id===category||visibleGroups.some(g=>g.id===n.id)||visibleWorks.some(w=>w.id===n.id)):undefined,padding:.18,maxZoom:1,minZoom:.2,duration:reduced()?0:420}),40);return()=>clearTimeout(timer);},[flow,expanded,resetVersion]);
 useEffect(()=>{if(selected){detail.current?.focus({preventScroll:true});if(innerWidth<768)detail.current?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'nearest'});}},[selected]);
 const mobileCategory=category&&expanded.includes(category)?category:null;
 const mobileGroup=group&&expanded.includes(group)?group:null;
 const mobileBack=()=>{setSelected(null);if(mobileGroup){setExpanded(old=>old.filter(id=>id!==mobileGroup));setGroup(null);}else if(mobileCategory){setExpanded(old=>old.filter(id=>id!==mobileCategory&&!graphGroups.some(g=>g.id===id&&g.category===mobileCategory)));setCategory(null);}};
 return <div ref={root} className={`work-graph${story?' work-graph--story':''}`} data-mode={story?'story':'explore'} data-story-domain={story?category:undefined}>
  <div ref={stage} className="graph-stage">
  <div className="graph-mode-switch" role="group" aria-label="图谱浏览方式"><button aria-pressed={!story} onClick={stopStory}><BlurText text={'自由探索'}/></button><button aria-pressed={story} onClick={enterStory} disabled={story}><BlurText text={'随页浏览'}/></button>{story&&<span role="status">{String(categories.findIndex(c=>c.id===category)+1).padStart(2,'0')} / 03 · {categories.find(c=>c.id===category)?.label} · 滚动继续，点击或拖动进入探索</span>}</div>
  <div className="graph-toolbar"><p className="graph-intro"><BlurText text={'三个设计领域，'}/><br/><BlurText text={'彼此连接的创作实践。'}/></p>
  <div className="graph-tools" aria-label="图谱操作"><button onClick={()=>{stopStory();void flow?.zoomOut({duration:reduced()?0:180});}} aria-label="缩小图谱">−</button><button onClick={()=>{stopStory();void flow?.zoomIn({duration:reduced()?0:180});}} aria-label="放大图谱">＋</button><button onClick={()=>{stopStory();void flow?.fitView({padding:.18,maxZoom:1,duration:reduced()?0:350});}}><BlurText text={'适应画布'}/></button><button onClick={reset}><BlurText text={'重置图谱'}/></button></div>
  <p className="graph-hint"><BlurText text={'拖动圆点，自由整理关系 · 拖动空白处移动画布 · 滚轮继续浏览页面'}/></p>
  </div>
  <nav className="graph-mobile-browser" aria-label="作品分层浏览">
   <div className="graph-mobile-heading">{mobileCategory?<button onClick={mobileBack}>← 返回{mobileGroup?'分类':'领域'}</button>:<span><BlurText text={'选择创作领域'}/></span>}<span>{mobileGroup?graphGroups.find(g=>g.id===mobileGroup)?.label:categories.find(c=>c.id===mobileCategory)?.label}</span></div>
   <div className="graph-mobile-items">
    {!mobileCategory?categories.map(c=><button key={c.id} onClick={()=>chooseCategory(c.id)}>{c.label}<span aria-hidden="true">↗</span></button>):!mobileGroup?<>
     {graphGroups.filter(g=>g.category===mobileCategory&&g.id!=='scenes').map(g=><button key={g.id} onClick={()=>chooseGroup(g.id)}>{g.label}<span>{graphWorks.filter(w=>w.group===g.id).length} 件</span></button>)}
     {mobileCategory==='aigc'&&graphWorks.filter(w=>w.group==='scenes').map(w=><button key={w.id} onClick={()=>chooseWork(w.id)}><img src={preview(w.id)} alt=""/>{w.title}<span aria-hidden="true">↗</span></button>)}
    </>:graphWorks.filter(w=>w.group===mobileGroup).map(w=><button key={w.id} aria-pressed={selected===w.id} onClick={()=>chooseWork(w.id)}><img src={preview(w.id)} alt=""/><span>{w.title}</span><span aria-hidden="true">↗</span></button>)}
   </div>
  </nav>
  <div className="graph-layout">
   <GraphCanvas models={nodes} edges={edges} resetVersion={resetVersion} onInit={setFlow} onManual={stopStory}/>
   {work&&<div className={`graph-detail${work.group==='apps'?' graph-detail--app':''}`} ref={detail} tabIndex={-1} role="region" aria-label="作品概况" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}>
    <button className="graph-close" onClick={close}><BlurText text={'返回图谱 ×'}/></button>{work.group==='apps'?<AppPreview key={work.id} id={work.id}/>:preview(work.id)&&(imageWork?<button className="graph-cover-button" onClick={openPreview} aria-label={`放大查看${work.title}`}><img key={work.id} src={preview(work.id)} alt={`${work.title}封面`} decoding="async"/><span>{media.length>1?`查看作品 · ${media.length} 项`:'查看作品'} ↗</span></button>:<img key={work.id} src={preview(work.id)} alt={`${work.title}封面`} loading="lazy" decoding="async"/>)}
    <span className="graph-detail-label">{graphGroups.find(g=>g.id===work.group)?.label}</span><h3><BlurText text={work.title}/></h3><p><BlurText text={work.summary}/></p>{confirmedEntry&&<div className="graph-confirmed-tags" aria-label="作品相关方向">{confirmedEntry.tags.map(tag=><span key={tag}><BlurText text={tag}/></span>)}</div>}<small>{work.pending?'待加入 · 暂无素材':work.date}</small>
    {!work.pending&&<a className="graph-detail-link" onClick={saveReturn} onAuxClick={saveReturn} target="_blank" rel="noopener noreferrer" aria-label={`${graphDetailKeys[work.id]?'查看完整作品详情':'查看完整作品详情'}（新标签页）`} href={graphDetailKeys[work.id]?`${legacyAsset('index.html',import.meta.env.BASE_URL)}?work=${graphDetailKeys[work.id]}&from=graph&graphReturn=${returnToken}`:mediaUrl(work.original)}><span>{graphDetailKeys[work.id]?'查看完整作品':'查看完整作品'}</span><span aria-hidden="true">↗</span></a>}
    <button className="graph-share" onClick={copyLink}><BlurText text={'复制作品链接 ↗'}/></button>{linkStatus&&<p role="status" className="graph-share-status">{linkStatus}</p>}
   </div>}
  </div>
  </div>
  <dialog ref={lightbox} className="graph-lightbox" aria-label={work?`${work.title}原图`:'作品原图'} onClose={()=>setImageOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setImageOpen(false);}}>
   {imageOpen&&work&&media[mediaIndex]&&<><InteractiveCursor/><button autoFocus aria-label="关闭" className="graph-lightbox-close" onClick={()=>setImageOpen(false)}><span aria-hidden="true">×</span></button><div className={videoGrid?"graph-video-grid":"graph-media-single"}>{videoGrid?media.map((item,i)=><section key={item.src}><span className="graph-video-label">{work.id==='ai-extra-6'?['产品与交互设计','平面与视觉设计','装置与公共艺术','基础图像生成'][i]:`片段 ${String(i+1).padStart(2,'0')}`}</span><WorkMedia item={item} title={`${work.title} · ${i+1}`}/></section>):<WorkMedia key={`${work.id}-${mediaIndex}`} item={media[mediaIndex]} title={work.title}/>}</div>{!videoGrid&&media.length>1&&<nav className="graph-media-nav" aria-label="作品图组"><button onClick={()=>setMediaIndex(i=>(i+media.length-1)%media.length)} aria-label="上一项"><span aria-hidden="true">←</span></button><span>{mediaIndex+1} / {media.length}</span><button onClick={()=>setMediaIndex(i=>(i+1)%media.length)} aria-label="下一项"><span aria-hidden="true">→</span></button></nav>}</>}
  </dialog>

 </div>;
}
