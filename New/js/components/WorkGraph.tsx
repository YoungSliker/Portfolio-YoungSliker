import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Background, Handle, Position, ReactFlow, useStore, type Edge, type Node, type NodeProps, type ReactFlowInstance } from '@xyflow/react';
import { useElasticGraph } from '../hooks/useElasticGraph';
import { categories } from '../../data/content';
import { graphGroups, graphWorks } from '../../data/graph';
import { legacyAsset } from '../lib/assets';
import '@xyflow/react/dist/style.css';
import '../../css/work-graph.css';

type Point={x:number;y:number};
type ArchiveNode=Node<{label:string;eyebrow:string;kind:string;cover?:string;active:boolean;choose:()=>void},'archive'>;
const anchors:Record<string,Point>={root:{x:0,y:0},aigc:{x:-300,y:-100},digital:{x:230,y:-210},visual:{x:220,y:260},media:{x:420,y:-400},apps:{x:550,y:-100},brand:{x:480,y:220},logos:{x:300,y:490},suiyuan:{x:-580,y:-270},'mine-eco':{x:-650,y:10},weiyuan:{x:-410,y:200}};
const dates:Record<string,string>={suiyuan:'2025.07','mine-eco':'2023.08',weiyuan:'2024.06'};
const previews=import.meta.glob('../../assets/images/graph/*.webp',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
const preview=(id:string)=>previews[`../../assets/images/graph/${id}.webp`];
const workPositions:Record<string,Point>={shuyun:{x:360,y:-650},'kinect-face':{x:620,y:-610},'kinect-water':{x:690,y:-380},xueban:{x:820,y:-250},yanchage:{x:870,y:0},zhucanbang:{x:680,y:130},kulun:{x:750,y:380},wanbu:{x:490,y:690},guisui:{x:170,y:730}};
const categoryType:Record<string,{en:string;lead:string;title:string;note:string}>={
 'AIGC设计':{en:'GENERATIVE / ART',lead:'生成式创作',title:'AIGC',note:'人工智能 · 视觉表达'},
 '数字体验设计':{en:'DIGITAL / EXPERIENCE',lead:'人与数字',title:'体验设计',note:'交互 · 空间 · 界面'},
 '视觉传达设计':{en:'VISUAL / COMMUNICATION',lead:'图形与文字',title:'视觉传达',note:'品牌 · 信息 · 秩序'},
};
function ArchiveNodeView({data}:NodeProps<ArchiveNode>){
 const typography=categoryType[data.label];
 return <div className={`archive-node archive-node--${data.kind}`} data-active={data.active}>
  <Handle type="target" position={Position.Top}/><Handle type="source" position={Position.Bottom}/>
  <button onClick={data.choose} aria-label={data.label}>
   <span className="archive-node-disc">{data.cover?<img src={data.cover} alt="" draggable={false}/>:data.kind==='category'&&typography?<span className="graph-type"><span className="graph-type-en">{typography.en}</span><i/><span className="graph-type-lead">{typography.lead}</span><b>{typography.title}</b><span className="graph-type-note">{typography.note}</span></span>:<span>{data.kind==='root'?'YS':'＋'}</span>}</span>
   {data.kind!=='category'&&<strong>{data.label}</strong>}<small>{data.kind==='root'?'CREATIVE UNIVERSE':data.kind==='work'?data.eyebrow:'点击展开 · 拖动探索'}</small>
  </button>
 </div>;
}
const nodeTypes={archive:memo(ArchiveNodeView)};
const nodeOrigin:[number,number]=[.5,.5];
const fitOptions={padding:.18,maxZoom:1};
const readZoom=(state:{transform:[number,number,number]})=>Math.round(state.transform[2]*100);
function ZoomReadout(){
 const zoom=useStore(readZoom);
 return <output className="graph-zoom-readout" aria-label="图谱缩放比例">{zoom}%</output>;
}
// Pointer updates stay inside the canvas; unchanged nodes retain their data and callbacks.
const GraphCanvas=memo(function GraphCanvas({models,edges,resetVersion,onInit}:{
 models:ArchiveNode[];edges:Edge[];resetVersion:number;onInit:(flow:ReactFlowInstance<ArchiveNode>)=>void;
}){
 const {nodes,onNodesChange,onNodeDragStart,onNodeDragStop}=useElasticGraph(models,edges,resetVersion);
 return <div className="graph-canvas" aria-label="作品关系图">
  <ReactFlow<ArchiveNode> nodes={nodes} edges={edges} nodeTypes={nodeTypes} onInit={onInit} onNodesChange={onNodesChange} onNodeDragStart={onNodeDragStart} onNodeDragStop={onNodeDragStop} nodeOrigin={nodeOrigin}
   fitView fitViewOptions={fitOptions} minZoom={.15} maxZoom={1.8} nodeDragThreshold={5} nodesDraggable nodesConnectable={false} elementsSelectable={false}
   zoomOnScroll={false} zoomOnDoubleClick={false} zoomOnPinch panOnScroll={false} preventScrolling={false} panOnDrag zoomActivationKeyCode={null}>
   <Background color="#c8bfae" gap={30} size={.7}/><ZoomReadout/>
  </ReactFlow>
 </div>;
});
export default function WorkGraph(){
 const [category,setCategory]=useState<string|null>('aigc');
 const [group,setGroup]=useState<string|null>(null);
 const [expanded,setExpanded]=useState<string[]>(['aigc']);
 const [selected,setSelected]=useState<string|null>(null);
 const [flow,setFlow]=useState<ReactFlowInstance<ArchiveNode>|null>(null);
 const [resetVersion,setResetVersion]=useState(0);
 const detail=useRef<HTMLDivElement>(null);
 const returnButton=useRef<HTMLButtonElement|null>(null);
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 const work=graphWorks.find(w=>w.id===selected);
 function reset(){setCategory('aigc');setGroup(null);setSelected(null);setExpanded(['aigc']);setResetVersion(v=>v+1);}
 function showAll(){setCategory(null);setGroup(null);setSelected(null);void flow?.fitView({padding:.18,maxZoom:1,duration:reduced()?0:300});}
 function chooseCategory(id:string){setCategory(id);setGroup(null);setSelected(null);setExpanded(old=>old.includes(id)?old:[...old,id]);}
 function chooseGroup(id:string){setGroup(id);setSelected(null);setExpanded(old=>old.includes(id)?old:[...old,id]);}
 function chooseWork(id:string){returnButton.current=document.activeElement instanceof HTMLButtonElement?document.activeElement:null;setSelected(id);}
 function close(){setSelected(null);returnButton.current?.focus({preventScroll:true});}
 const visibleGroups=graphGroups.filter(g=>g.id!=='scenes'&&expanded.includes(g.category));
 const visibleWorks=graphWorks.filter(w=>expanded.includes(w.group==='scenes'?'aigc':w.group));
 const nodes:ArchiveNode[]=useMemo(()=>{
  const make=(id:string,label:string,eyebrow:string,kind:string,choose:()=>void,cover?:string):ArchiveNode=>({id,type:'archive',position:anchors[id]??workPositions[id],data:{label,eyebrow,kind,cover,active:selected===id||category===id||group===id,choose},focusable:false});
  return [make('root','YOUNGSLIKER','CREATIVE UNIVERSE','root',showAll),...categories.map(c=>make(c.id,c.label,c.number,'category',()=>chooseCategory(c.id))),...visibleGroups.map(g=>make(g.id,g.label,'','group',()=>chooseGroup(g.id))),...visibleWorks.map(w=>make(w.id,w.title,dates[w.id]??'PROJECT','work',()=>chooseWork(w.id),preview(w.id)))];
 },[expanded,category,group,selected,flow]);
 const edges=useMemo(()=>[
  ...categories.map(c=>({id:`root-${c.id}`,source:'root',target:c.id})),
  ...visibleGroups.map(g=>({id:`${g.category}-${g.id}`,source:g.category,target:g.id})),
  ...visibleWorks.map(w=>({id:`${w.group}-${w.id}`,source:w.group==='scenes'?'aigc':w.group,target:w.id})),
  // Both projects are explicitly described as interactive experiences by the author.
  ...(expanded.includes('aigc')?['suiyuan','weiyuan'].map(id=>({id:`experience-${id}`,source:'digital',target:id})):[]),
 ].map(e=>({...e,type:'straight',style:{stroke:e.id.startsWith('experience')?'#d9b49b':'#b7aa99',strokeWidth:e.source==='root'?1.5:1,strokeDasharray:e.id.startsWith('experience')?'4 6':undefined},focusable:false})),[expanded]);
 useEffect(()=>{if(!flow)return;const timer=setTimeout(()=>void flow.fitView({padding:.18,maxZoom:1,minZoom:.2,duration:reduced()?0:420}),40);return()=>clearTimeout(timer);},[flow,expanded,resetVersion]);
 useEffect(()=>{if(selected){detail.current?.focus({preventScroll:true});if(innerWidth<768)detail.current?.scrollIntoView({behavior:reduced()?'instant':'smooth',block:'nearest'});}},[selected]);
 return <div className="work-graph">
  <div className="graph-tools" aria-label="图谱操作"><button onClick={()=>void flow?.zoomOut({duration:reduced()?0:180})} aria-label="缩小图谱">−</button><button onClick={()=>void flow?.zoomIn({duration:reduced()?0:180})} aria-label="放大图谱">＋</button><button onClick={()=>void flow?.fitView({padding:.18,maxZoom:1,duration:reduced()?0:350})}>适应画布</button><button onClick={reset}>重置图谱</button></div>
  <p className="graph-hint">拖动圆点，自由整理关系 · 拖动空白处移动画布 · 滚轮继续浏览页面</p>
  <div className="graph-layout">
   <GraphCanvas models={nodes} edges={edges} resetVersion={resetVersion} onInit={setFlow}/>
   {work&&<div className="graph-detail" ref={detail} tabIndex={-1} role="region" aria-label="作品概况" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}>
    <button className="graph-close" onClick={close}>返回图谱 ×</button><img key={work.id} src={preview(work.id)} alt={`${work.title}封面`} loading="lazy" decoding="async"/>
    <span className="graph-detail-label">{graphGroups.find(g=>g.id===work.group)?.label}</span><h3>{work.title}</h3><p>{work.summary}</p><small>资料来源：{work.source}</small><a className="text-link" href={legacyAsset('index.html',import.meta.env.BASE_URL)}>浏览旧版完整作品集 ↗</a>
   </div>}
  </div>

 </div>;
}
