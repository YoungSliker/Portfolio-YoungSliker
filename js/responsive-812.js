(()=>{
 const home=document.getElementById('home');
 function resize(){
  const width=document.documentElement.clientWidth,height=window.visualViewport?.height||window.innerHeight;
  const scale=Math.min(width*(width<700?.92:.8333)/1561.6,height*.5555/538.27);
  home.style.setProperty('--home-poster-scale',String(scale));
 }
 resize();window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});
})();

/* Mobile browsers require a user gesture before granting sensor access.
   The same normalized tilt powers the home title and the profile-card depth. */
(()=>{
 const button=document.createElement('button');
 button.id='portfolio-motion-toggle';
 button.type='button';
 button.textContent='开启体感';
 button.setAttribute('aria-label','开启陀螺仪体感效果');
 document.body.append(button);
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
  enabled=true;button.textContent='体感已开启';button.classList.add('is-enabled');
  window.addEventListener('deviceorientation',onOrientation,{passive:true});
  frame=requestAnimationFrame(render);
 };
 button.addEventListener('click',async()=>{
  try{
   if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
    const permission=await DeviceOrientationEvent.requestPermission();
    if(permission!=='granted')throw new Error('denied');
   }
   start();
  }catch(error){button.textContent='体感未授权';}
 });
 if(typeof DeviceOrientationEvent==='undefined')button.hidden=true;
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
