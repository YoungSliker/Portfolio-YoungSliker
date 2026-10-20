import { useEffect, useMemo, useRef, useState } from 'react';
import { Background, Handle, Position, ReactFlow, type Node, type NodeProps, type ReactFlowInstance } from '@xyflow/react';
import { categories } from '../../data/content';
import { graphGroups, graphWorks } from '../../data/graph';
import { legacyAsset } from '../lib/assets';
import '@xyflow/react/dist/style.css';
import '../../css/work-graph.css';

type ArchiveNode = Node<{label:string; eyebrow:string; kind:string; active:boolean; choose:()=>void},'archive'>;
function ArchiveNodeView({data}:NodeProps<ArchiveNode>) {
  return <div className={`archive-node archive-node--${data.kind}`} data-active={data.active}>
    <Handle type="target" position={Position.Left} />
    <button className="nodrag" onClick={data.choose} aria-label={data.label}>
      <span>{data.eyebrow}</span><strong>{data.label}</strong><i aria-hidden="true">↗</i>
    </button>
    <Handle type="source" position={Position.Right} />
  </div>;
}
const nodeTypes={archive:ArchiveNodeView};
export default function WorkGraph() {
  const [category,setCategory]=useState<string|null>(null);
  const [group,setGroup]=useState<string|null>(null);
  const [selected,setSelected]=useState<string|null>(null);
  const [flow,setFlow]=useState<ReactFlowInstance<ArchiveNode>|null>(null);
  const [drag,setDrag]=useState(false);
  const [zoom,setZoom]=useState(1);
  const detail=useRef<HTMLDivElement>(null);
  const returnButton=useRef<HTMLButtonElement|null>(null);
  const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
  const work=graphWorks.find(w=>w.id===selected);
  const groups=graphGroups.filter(g=>g.category===category);
  const works=graphWorks.filter(w=>w.group===group);
  function reset(){
    setCategory(null);setGroup(null);setSelected(null);
    void flow?.fitView({nodes:['root',...categories.map(c=>c.id)].map(id=>({id})),padding:.2,maxZoom:1,duration:reduced()?0:350});
  }
  function chooseCategory(id:string){setCategory(id);setGroup(null);setSelected(null);}
  function chooseGroup(id:string){setGroup(id);setSelected(null);}
  function chooseWork(id:string){
    returnButton.current=document.activeElement instanceof HTMLButtonElement?document.activeElement:null;
    setSelected(id);
    const node=flow?.getNode(id);
    if(node) void flow?.setCenter(node.position.x+105,node.position.y+42,{zoom:1,duration:reduced()?0:350});
  }
  function close(){setSelected(null);returnButton.current?.focus({preventScroll:true});}
  const nodes:ArchiveNode[]=useMemo(()=>{
    const make=(id:string,label:string,eyebrow:string,kind:string,x:number,y:number,active:boolean,choose:()=>void):ArchiveNode=>({
      id,type:'archive',position:{x,y},data:{label,eyebrow,kind,active,choose},focusable:false,
    });
    return [
      make('root','创作宇宙','YOUNGSLIKER / 12 WORKS','root',0,160,false,reset),
      ...categories.map((c,i)=>make(c.id,c.label,c.title,'category',300,i*160,category===c.id,()=>chooseCategory(c.id))),
      ...groups.map((g,i)=>make(g.id,g.label,'COLLECTION','group',600,i*160,group===g.id,()=>chooseGroup(g.id))),
      ...works.map((w,i)=>make(w.id,w.title,'PROJECT','work',900,i*130,selected===w.id,()=>chooseWork(w.id))),
    ];
  },[category,group,selected,flow]);
  const edges=useMemo(()=>[
    ...categories.map(c=>({id:`root-${c.id}`,source:'root',target:c.id})),
    ...groups.map(g=>({id:`${category}-${g.id}`,source:category!,target:g.id})),
    ...works.map(w=>({id:`${group}-${w.id}`,source:group!,target:w.id})),
  ].map(e=>({...e,type:'smoothstep',style:{stroke:'#b4a99a',strokeWidth:1.2},focusable:false})),[category,group]);
  useEffect(()=>{
    if(!flow)return;
    const frame=requestAnimationFrame(()=>{
      const ids=group?[group,...graphWorks.filter(w=>w.group===group).map(w=>w.id)]:
        category?[category,...graphGroups.filter(g=>g.category===category).map(g=>g.id)]:['root',...categories.map(c=>c.id)];
      void flow.fitView({nodes:ids.map(id=>({id})),padding:.2,maxZoom:1,minZoom:.35,duration:reduced()?0:350});
    });
    return()=>cancelAnimationFrame(frame);
  },[flow,category,group]);
  useEffect(()=>{if(selected)detail.current?.focus({preventScroll:true});},[selected]);
  return <div className="work-graph">
    <div className="graph-topline"><span>CONNECTED PRACTICES</span><span>12 件作品 · 三个领域</span></div>
    <nav className="graph-breadcrumb" aria-label="作品图谱分类">
      <button onClick={reset} aria-pressed={!category}>全部领域</button>
      {categories.map(c=><button key={c.id} onClick={()=>chooseCategory(c.id)} aria-pressed={category===c.id}>{c.label}</button>)}
    </nav>
    <div className="graph-layout">
      <div>
        <div className="graph-canvas" aria-label="作品关系图">
          <ReactFlow<ArchiveNode> nodes={nodes} edges={edges} nodeTypes={nodeTypes} onInit={setFlow}
            fitView fitViewOptions={{padding:.2,maxZoom:1}} minZoom={.3} maxZoom={1.6}
            nodesDraggable={false} nodesConnectable={false} elementsSelectable={false}
            zoomOnScroll={false} zoomOnDoubleClick={false} zoomOnPinch panOnScroll={false}
            preventScrolling={false} panOnDrag={drag} zoomActivationKeyCode={null}
            onMove={(_,v)=>setZoom(v.zoom)}>
            <Background color="#c8bfae" gap={24} size={1} />
          </ReactFlow>
        </div>
        <div className="graph-tools" aria-label="图谱操作">
          <button onClick={()=>void flow?.zoomOut({duration:reduced()?0:180})} aria-label="缩小图谱">−</button>
          <output aria-label="图谱缩放比例">{Math.round(zoom*100)}%</output>
          <button onClick={()=>void flow?.zoomIn({duration:reduced()?0:180})} aria-label="放大图谱">＋</button>
          <button onClick={()=>void flow?.fitView({padding:.2,maxZoom:1,duration:reduced()?0:350})}>适应画布</button>
          <button onClick={()=>setDrag(!drag)} aria-pressed={drag}>{drag?'退出拖动画布':'拖动画布'}</button>
          <button onClick={reset}>返回中心</button>
        </div>
        <p className="graph-hint">滚轮浏览页面 · ＋ / − 缩放 · 开启拖动后可移动画布</p>
        {category&&<div className="graph-collection" aria-label="子分类">
          {groups.map(g=><button key={g.id} aria-pressed={group===g.id} onClick={()=>chooseGroup(g.id)}>{g.label} <span>{graphWorks.filter(w=>w.group===g.id).length}</span></button>)}
        </div>}
        {group&&<div className="graph-work-list" aria-label="当前分类作品">
          {works.map(w=><button key={w.id} aria-pressed={selected===w.id} onClick={()=>chooseWork(w.id)}>{w.title}<span aria-hidden="true">↗</span></button>)}
        </div>}
      </div>
      <div className="graph-detail" ref={detail} tabIndex={-1} role="region" aria-label="作品概况" onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}}}>
        {work?<><button className="graph-close" onClick={close}>返回图谱 ×</button>
          <img key={work.id} src={legacyAsset(work.cover,import.meta.env.BASE_URL)} alt={`${work.title}封面`} loading="lazy" decoding="async"/>
          <span className="graph-detail-label">{graphGroups.find(g=>g.id===work.group)?.label}</span>
          <h3>{work.title}</h3><p>{work.summary}</p><small>资料来源：{work.source}</small>
          <a className="text-link" href={legacyAsset('index.html',import.meta.env.BASE_URL)}>浏览旧版完整作品集 ↗</a>
        </>:<><span className="graph-detail-label">SELECT A CONNECTION</span><h3>沿着兴趣，<br/>发现下一件作品。</h3><p>从分类开始，展开一个创作方向，再点选作品查看概况。</p><div className="graph-detail-mark" aria-hidden="true">✳</div></>}
      </div>
    </div>
  </div>;
}
