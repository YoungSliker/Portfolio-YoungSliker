import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { toPng } from 'html-to-image';
import { ArtworkTicket } from './ArtworkTicket';
import PaperCrumple from './PaperCrumple';
import type { PaperController } from './PaperCrumple.types';
import '../../css/random-artwork-ticket.css';

export type RandomWork={id:string;title:string;image?:string};
const wait=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
async function snapshot(root:HTMLElement) {
  const sheet=root.querySelector<HTMLElement>('.artwork-ticket__sheet')!;
  for(let i=0;i<80;i++) {
    const qr=sheet.querySelector<HTMLImageElement>('.artwork-ticket__qr');
    if(qr?.complete && qr.naturalWidth)break;
    await wait(25);
  }
  if(!sheet.querySelector('.artwork-ticket__qr'))throw Error('QR not ready');
  await Promise.all(Array.from(sheet.querySelectorAll('img')).map(img=>img.decode()));
  return toPng(sheet,{width:280,height:464,pixelRatio:2,skipFonts:true,
    style:{transform:'none',transformOrigin:'0 0',filter:'none',opacity:'1'}});
}
async function preload(src?:string) {
  if(!src)throw Error('Missing cover');
  const image=new Image();image.src=src;await image.decode();
}

export function RandomArtworkTicket({works,initial}:{works:RandomWork[];initial:RandomWork}) {
  const root=useRef<HTMLDivElement>(null),live=useRef<HTMLDivElement>(null);
  const control=useRef<PaperController|null>(null);
  const current=useRef(initial);
  const [work,setWork]=useState(initial),[texture,setTexture]=useState('');
  const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[busy,setBusy]=useState(false);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  useEffect(()=>{
    if(reduced)return;
    let disposed=false;
    const prepare=async()=>{
      while(!disposed && root.current?.closest('#hero')?.getAttribute('data-entrance')!=='ready')await wait(100);
      if(disposed||!live.current)return;
      try{const image=await snapshot(live.current);if(!disposed)setTexture(image);}catch{if(!disposed)setFailed(true);}
    };
    void prepare();return()=>{disposed=true;};
  },[reduced]);
  useEffect(()=>{
    setBusy(false);
    if(!ready&&!failed&&!reduced)return;
    let disposed=false,timer=0,inView=true;
    const host=root.current!;
    const observer=new IntersectionObserver(([entry])=>{inView=entry.isIntersecting;if(!inView)control.current?.reset();},{threshold:.5});
    observer.observe(host);
    const visibility=()=>{if(document.hidden)control.current?.reset();};
    document.addEventListener('visibilitychange',visibility);
    const eligible=()=>inView&&!document.hidden&&!host.matches(':hover')&&!host.contains(document.activeElement)&&!host.querySelector('[data-grabbing]')&&!document.querySelector('dialog[open]')&&host.closest('#hero')?.getAttribute('data-entrance')==='ready';
    const schedule=(delay=5000)=>{if(!disposed)timer=window.setTimeout(cycle,delay);};
    const cycle=async()=>{
      if(disposed)return;
      if(!eligible()){schedule(500);return;}
      const others=works.filter(item=>item.id!==current.current.id&&item.image!==current.current.image);
      if(!others.length)return;
      const next=others[Math.floor(Math.random()*others.length)];
      const started=performance.now();
      try {
        await preload(next.image);
        if(disposed||!eligible())return;
        const api=control.current;
        if(!reduced&&!failed&&api) {
          await api.image(await snapshot(live.current!));
          if(disposed||!eligible())return;
          flushSync(()=>setBusy(true));
          if(!await api.fold(1)||disposed)return;
          await wait(350);
          if(disposed)return;
          if(!inView||document.hidden)return;
          current.current=next;flushSync(()=>setWork(next));
          await api.image(await snapshot(live.current!));
          if(disposed)return;
          await api.fold(0);
        } else {current.current=next;setWork(next);}
      } catch {if(!disposed)setFailed(true);}
      finally {if(!disposed){control.current?.reset();setBusy(false);schedule(Math.max(500,5000-(performance.now()-started)));}}
    };
    schedule();
    return()=>{disposed=true;clearTimeout(timer);observer.disconnect();document.removeEventListener('visibilitychange',visibility);control.current?.reset();};
  },[ready,failed,reduced,works]);
  return <div ref={root} className="random-artwork" data-changing={busy?'true':'false'} data-work={work.id} data-crumple={failed?'fallback':ready?'ready':'loading'}>
    <div ref={live} className="random-artwork__live" inert={busy}>
      <ArtworkTicket key={work.id} title={work.title} description="创作选集" date="RANDOM" image={work.image}
        qrValue={`${location.origin}${import.meta.env.BASE_URL}#work=${work.id}`} width={280} height={360}/>
    </div>
    {texture&&!reduced&&!failed&&<div className="random-artwork__fold" aria-hidden="true">
      <PaperCrumple src={texture} autoRef={control} onReady={()=>setReady(true)} onError={()=>setFailed(true)}
        width={280} height={464} sceneHeight="100%" inset={0} detail={64} foldCount={8} foldSharpness={.35}
        crumpleDuration={.8} releaseDuration={.65} paperColor="#fffdf7" draggable={false} disabled
        imageFit="contain" shadow={false} paperTexture={.06}/>
    </div>}
  </div>;
}
