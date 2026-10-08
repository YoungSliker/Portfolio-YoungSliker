(()=>{
 const home=document.getElementById('home');
 function resize(){
  const width=document.documentElement.clientWidth,height=window.visualViewport?.height||window.innerHeight;
  const isPhoneLandscape=width>height&&height<=500;
  if(isPhoneLandscape){
   const scale=height/1080;
   const safeWidth=height*16/9;
   const safeLeft=(width-safeWidth)/2;
   document.documentElement.style.setProperty('--desktop-safe-width',safeWidth+'px');
   document.documentElement.style.setProperty('--desktop-safe-left',safeLeft+'px');
   document.documentElement.style.setProperty('--desktop-scale',String(scale));
   document.documentElement.style.setProperty('--profile-left',(safeLeft+safeWidth*.00706+20*scale)+'px');
   document.documentElement.style.setProperty('--profile-top',(-height*.06801+50*scale)+'px');
   document.documentElement.style.setProperty('--profile-width',(safeWidth*.9562)+'px');
   document.documentElement.style.setProperty('--profile-height',(height*.90547)+'px');
   document.documentElement.style.setProperty('--profile-title-size',(68*scale)+'px');
   document.documentElement.style.setProperty('--profile-info-size',(30*scale)+'px');
   document.documentElement.style.setProperty('--profile-info-gap',(30*scale)+'px');
   document.documentElement.style.setProperty('--stack-top',(130*scale)+'px');
   document.documentElement.style.setProperty('--stack-side',(48*scale)+'px');
   document.documentElement.style.setProperty('--stack-content-width',Math.min(safeWidth,1240*scale)+'px');
   document.documentElement.style.setProperty('--nav-card-height',(292*scale)+'px');
   document.documentElement.style.setProperty('--nav-card-gap',(14*scale)+'px');
   document.documentElement.style.setProperty('--nav-panel-width',Math.min(safeWidth,1180*scale)+'px');
   document.documentElement.style.setProperty('--nav-overlay-top',(112*scale)+'px');
   document.documentElement.style.setProperty('--nav-overlay-side',(28*scale)+'px');
   document.documentElement.style.setProperty('--nav-overlay-bottom',(34*scale)+'px');
   document.documentElement.style.setProperty('--nav-card-padding',(22*scale)+'px');
   document.documentElement.style.setProperty('--nav-card-radius',(28*scale)+'px');
   document.documentElement.style.setProperty('--nav-title-size',(34*scale)+'px');
   document.documentElement.style.setProperty('--nav-index-size',(34*scale)+'px');
   document.documentElement.style.setProperty('--nav-index-font-size',(10*scale)+'px');
   document.documentElement.style.setProperty('--nav-eyebrow-size',(16*scale)+'px');
   document.documentElement.style.setProperty('--nav-heading-size',(64*scale)+'px');
   document.documentElement.style.setProperty('--nav-hint-size',(21*scale)+'px');
   document.documentElement.style.setProperty('--stack-card-height',(560*scale)+'px');
   document.documentElement.style.setProperty('--stack-card-radius',(32*scale)+'px');
   document.documentElement.style.setProperty('--stack-heading-gap',(70*scale)+'px');
   document.documentElement.style.setProperty('--stack-heading-size',(78*scale)+'px');
   document.documentElement.style.setProperty('--stack-heading-copy-size',(22*scale)+'px');
   document.documentElement.style.setProperty('--stack-label-bottom',(34*scale)+'px');
   document.documentElement.style.setProperty('--stack-label-left',(38*scale)+'px');
   document.documentElement.style.setProperty('--stack-label-size',(38*scale)+'px');
   document.documentElement.style.setProperty('--stack-label-copy-size',(17*scale)+'px');
   document.documentElement.style.setProperty('--stack-number-top',(28*scale)+'px');
   document.documentElement.style.setProperty('--stack-number-right',(34*scale)+'px');
   document.documentElement.style.setProperty('--stack-number-size',(78*scale)+'px');
   document.documentElement.style.setProperty('--drift-tile-w',(200*scale)+'px');
   document.documentElement.style.setProperty('--drift-tile-h',(132*scale)+'px');
   document.documentElement.style.setProperty('--drift-gap',(18*scale)+'px');
   document.documentElement.style.setProperty('--drift-radius',(14*scale)+'px');
   document.documentElement.style.setProperty('--detail-title-size',(160*scale)+'px');
   document.documentElement.style.setProperty('--detail-kicker-size',(18*scale)+'px');
   home.style.setProperty('--home-poster-scale',String(scale*1.024));
  }else{
   ['--desktop-safe-width','--desktop-safe-left','--desktop-scale','--profile-left','--profile-top','--profile-width','--profile-height','--profile-title-size','--profile-info-size','--profile-info-gap','--stack-top','--stack-side','--stack-content-width','--nav-card-height','--nav-card-gap','--nav-panel-width','--nav-overlay-top','--nav-overlay-side','--nav-overlay-bottom','--nav-card-padding','--nav-card-radius','--nav-title-size','--nav-index-size','--nav-index-font-size','--nav-eyebrow-size','--nav-heading-size','--nav-hint-size','--stack-card-height','--stack-card-radius','--stack-heading-gap','--stack-heading-size','--stack-heading-copy-size','--stack-label-bottom','--stack-label-left','--stack-label-size','--stack-label-copy-size','--stack-number-top','--stack-number-right','--stack-number-size','--drift-tile-w','--drift-tile-h','--drift-gap','--drift-radius','--detail-title-size','--detail-kicker-size'].forEach(name=>document.documentElement.style.removeProperty(name));
   const scale=Math.min(width*(width<700?.92:.8333)/1561.6,height*.5555/538.27);
   home.style.setProperty('--home-poster-scale',String(scale));
  }
 }
 resize();window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});
})();

/* The same normalized tilt powers the home title and the profile-card depth.
   Android starts immediately; iOS asks through its native prompt on first touch. */
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let enabled=false,frame=0,tiltX=0,tiltY=0;
 const clamp=(value,limit=1)=>Math.max(-limit,Math.min(limit,value));
 const isLandscapePhone=()=>matchMedia('(max-height:500px) and (orientation:landscape)').matches;
 const render=()=>{
  frame=0;
  if(!enabled||reduced.matches||!isLandscapePhone())return;
  const titleStage=document.querySelector('[data-home-depth-stage]');
  if(document.querySelector('#home.active')&&titleStage) titleStage.style.transform=`rotateX(${(-2.4-tiltY*5).toFixed(3)}deg) rotateY(${(3.1+tiltX*8).toFixed(3)}deg)`;
  const profile=document.getElementById('bg-3d-wrapper');
  const card=document.getElementById('bg12-content');
  if(profile?.classList.contains('expanded-bg13')&&card){
   card.style.setProperty('--profile-tilt-x',(-tiltY*3.4).toFixed(3)+'deg');
   card.style.setProperty('--profile-tilt-y',(tiltX*4.2).toFixed(3)+'deg');
   card.style.setProperty('--profile-tilt-scale','1.003');
   card.style.setProperty('--profile-info-x',(tiltX*5).toFixed(2)+'px');
   card.style.setProperty('--profile-info-y',(-tiltY*4).toFixed(2)+'px');
  }
  frame=requestAnimationFrame(render);
 };
 const onOrientation=event=>{
  const rotation=screen.orientation?.angle||window.orientation||0;
  const beta=event.beta||0,gamma=event.gamma||0;
  tiltX=clamp((rotation===90||rotation===-270?beta:gamma)/32)*(rotation===270||rotation===-90?-1:1);
  tiltY=clamp((rotation===90||rotation===-270?gamma:beta)/32);
  if(!frame)frame=requestAnimationFrame(render);
 };
 const start=()=>{
  if(enabled||reduced.matches)return;
  enabled=true;
  window.addEventListener('deviceorientation',onOrientation,{passive:true});
  frame=requestAnimationFrame(render);
 };
 const requestIOSPermission=async()=>{
  try{
   if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
    const permission=await DeviceOrientationEvent.requestPermission();
    if(permission!=='granted')throw new Error('denied');
   }
   start();
  }catch(error){}
 };
 if(typeof DeviceOrientationEvent==='undefined')return;
 if(typeof DeviceOrientationEvent.requestPermission==='function'){
  window.addEventListener('pointerdown',requestIOSPermission,{once:true,passive:true});
 }else start();
})();

(()=>{
 const notice=document.createElement('aside');
 notice.id='portfolio-orientation-notice';
 notice.setAttribute('role','dialog');
 notice.setAttribute('aria-modal','true');
 notice.setAttribute('aria-label','横屏浏览提示');
 notice.innerHTML='<div class="portfolio-orientation-card"><i class="portfolio-orientation-icon" aria-hidden="true"></i><h1>请横屏浏览</h1><p>将手机横向旋转，即可完整播放作品集。</p><button type="button">尝试横屏播放</button></div>';
 document.body.append(notice);
 const button=notice.querySelector('button');
 button.addEventListener('click',async()=>{
  try{
   if(document.documentElement.requestFullscreen&&!document.fullscreenElement) await document.documentElement.requestFullscreen();
   if(screen.orientation?.lock) await screen.orientation.lock('landscape');
  }catch(error){}
 });
})();
