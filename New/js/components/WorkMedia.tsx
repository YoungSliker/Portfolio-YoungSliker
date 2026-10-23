import {useRef,useState} from 'react';
import {legacyAsset} from '../lib/assets';
export type WorkMedium={src:string;type:string};
export function WorkMedia({item,title}:{item:WorkMedium;title:string}){
 const video=useRef<HTMLVideoElement>(null);
 const [playing,setPlaying]=useState(false),[muted,setMuted]=useState(false),[progress,setProgress]=useState(0),[error,setError]=useState(false);
 const src=legacyAsset(item.src,import.meta.env.BASE_URL);
 if(item.type==='image')return <img src={src} alt={title}/>;
 const loop=item.type==='loop';
 return <div className="graph-video">
  <video ref={video} src={src} aria-label={title} playsInline preload="metadata" autoPlay={loop} muted={loop||muted} loop={loop} controls={false} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onError={()=>setError(true)} onTimeUpdate={()=>{const v=video.current;if(v?.duration)setProgress(v.currentTime/v.duration*1000);}}/>
  {!loop&&<div className="graph-video-controls"><button onClick={()=>{const v=video.current;if(v)v.paused?v.play().catch(()=>setError(true)):v.pause();}}>{playing?'暂停':'播放'}</button><input aria-label="视频进度" type="range" min="0" max="1000" value={progress} onChange={e=>{const v=video.current;if(v&&Number.isFinite(v.duration))v.currentTime=Number(e.target.value)/1000*v.duration;}}/><button onClick={()=>setMuted(v=>!v)}>{muted?'开启声音':'静音'}</button></div>}
  {error&&<p role="alert">视频暂时无法播放，请通过完整作品详情查看。</p>}
 </div>;
}
