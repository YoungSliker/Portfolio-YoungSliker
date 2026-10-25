import {useCallback,useRef,useState,type CSSProperties} from 'react';
import '../../css/work-graph.css';
import {legacyAsset} from '../lib/assets';
export type WorkMedium={src:string;type:string};
const localVideos=import.meta.glob('../../assets/videos/03 The Journey/*.mp4',{eager:true,query:'?url',import:'default'}) as Record<string,string>;
export const mediaUrl=(src:string)=>localVideos['../../'+src.replace(/^New\//,'')]??legacyAsset(src,import.meta.env.BASE_URL);
const clock=(seconds:number)=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
export function WorkMedia({item,title,resolvedSrc,focusOnMount=false}:{item:WorkMedium;title:string;resolvedSrc?:string;focusOnMount?:boolean}){
 const video=useRef<HTMLVideoElement>(null),seeking=useRef(false);
 const [playing,setPlaying]=useState(false),[muted,setMuted]=useState(false),[progress,setProgress]=useState(0),[error,setError]=useState(false),[duration,setDuration]=useState(0);
 const [ratio,setRatio]=useState(16/9);
 const src=resolvedSrc??mediaUrl(item.src);
 const focusPlay=useCallback((button:HTMLButtonElement|null)=>{if(focusOnMount)button?.focus({preventScroll:true});},[focusOnMount]);
 if(item.type==='image')return <img src={src} alt={title}/>;
 const loop=item.type==='loop';
 const seek=(value:number)=>{setProgress(value);const v=video.current;if(v&&Number.isFinite(v.duration)&&v.duration>0)v.currentTime=value/1000*v.duration;};
 return <div className="graph-video" style={{'--video-ratio':ratio} as CSSProperties}>
  <div className="graph-video-stage">
  <video ref={video} src={src} aria-label={title} playsInline preload="metadata" autoPlay={loop} muted={loop||muted} loop={loop} controls={false} disablePictureInPicture disableRemotePlayback controlsList="nodownload noremoteplayback nofullscreen" onLoadedMetadata={()=>{setDuration(Number.isFinite(video.current?.duration)?video.current!.duration:0);if(video.current?.videoHeight)setRatio(video.current.videoWidth/video.current.videoHeight);}} onPlay={()=>{setPlaying(true);if(!loop)document.querySelectorAll<HTMLVideoElement>('.graph-video video').forEach(v=>{if(v!==video.current&&!v.loop)v.pause();});}} onPause={()=>setPlaying(false)} onError={()=>setError(true)} onTimeUpdate={()=>{const v=video.current;if(!seeking.current&&v?.duration)setProgress(v.currentTime/v.duration*1000);}}/>
  </div>
  {!loop&&<div className="graph-video-controls">
   <button ref={focusPlay} aria-label={playing?'暂停':'播放'} onClick={()=>{const v=video.current;if(v)v.paused?v.play().catch(()=>setError(true)):v.pause();}}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">{playing?<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>:<path d="m7 4 14 8-14 8z"/>}</svg></button>
   <span className="graph-video-time">{clock(progress/1000*duration)}</span>
   <input aria-label="视频进度" aria-valuetext={`${clock(progress/1000*duration)} / ${clock(duration)}`} type="range" min="0" max="1000" step="1" disabled={!duration} value={progress} style={{'--played':`${progress/10}%`} as CSSProperties} onPointerDown={()=>{seeking.current=true;}} onPointerUp={()=>{seeking.current=false;}} onPointerCancel={()=>{seeking.current=false;}} onBlur={()=>{seeking.current=false;}} onChange={e=>seek(Number(e.target.value))}/>
   <span className="graph-video-time">{clock(duration)}</span>
   <button aria-label={muted?'开启声音':'静音'} onClick={()=>setMuted(v=>!v)}><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4 6 8H2v8h4l5 4z"/>{muted?<path d="m16 9 6 6m0-6-6 6"/>:<><path d="M15 8a6 6 0 0 1 0 8"/><path d="M18 4a11 11 0 0 1 0 16"/></>}</svg></button>
  </div>}
  {error&&<p role="alert">视频暂时无法播放，请通过完整作品详情查看。</p>}
 </div>;
}
