(()=>{
 const home=document.getElementById('home');
 function resize(){
  const width=document.documentElement.clientWidth,height=window.visualViewport?.height||window.innerHeight;
  const scale=Math.min(width*(width<700?.92:.8333)/1561.6,height*.5555/538.27);
  home.style.setProperty('--home-poster-scale',String(scale));
 }
 resize();window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});
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
