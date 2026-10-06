(()=>{
function update(){
 document.querySelectorAll('.drift-close:not([data-centered])').forEach(b=>{b.dataset.centered='1';b.innerHTML='<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M5 5L15 15M15 5L5 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';b.style.cssText+=';display:grid;place-items:center;padding:0;line-height:1';});
 document.querySelectorAll('.work-squares').forEach(g=>{g.className='work-accordion';Array.from(g.children).forEach((f,i)=>{f.style.cssText='position:relative;min-width:0;flex:1;overflow:hidden;border-radius:14px;margin:0;transition:flex .45s ease';f.tabIndex=0;f.setAttribute('role','button');const activate=()=>{Array.from(g.children).forEach(x=>{x.style.flex=x===f?'9':'1';x.setAttribute('aria-pressed',x===f?'true':'false')})};f.addEventListener('pointerenter',activate);f.addEventListener('focus',activate);f.addEventListener('click',activate);if(i===0)activate();});});
 document.querySelectorAll('.work-section-title').forEach(h=>{
  if(!h.textContent.includes('龙文化'))return;
  const g=h.nextElementSibling;if(!g||g.dataset.magnify)return;
  const img=g.querySelector('img');if(!img)return;
  g.dataset.magnify='1';g.className='dragon-magnify';
  const lens=document.createElement('div'),canvas=document.createElement('canvas');
  lens.className='dragon-lens';lens.hidden=true;lens.appendChild(canvas);g.appendChild(lens);
  const dpr=Math.min(window.devicePixelRatio||1,2),size=180,zoom=3;
  canvas.width=canvas.height=Math.round(size*dpr);const ctx=canvas.getContext('2d',{alpha:false});
  let raf=0,active=false,rect=null,px=0,py=0;
  function draw(){
   raf=0;if(!active||!g.isConnected||!img.complete||!img.naturalWidth)return;
   if(!rect)rect=img.getBoundingClientRect();if(!rect.width||!rect.height)return;
   const x=Math.max(0,Math.min(rect.width,px-rect.left)),y=Math.max(0,Math.min(rect.height,py-rect.top));
   const sx=img.naturalWidth/rect.width,sy=img.naturalHeight/rect.height;
   const w=size/zoom*sx,hh=size/zoom*sy;
   ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
   ctx.drawImage(img,x*sx-w/2,y*sy-hh/2,w,hh,0,0,canvas.width,canvas.height);
   lens.style.transform='translate3d('+(x-size/2)+'px,'+(y-size/2)+'px,0)';lens.hidden=false;
  }
  function schedule(){if(active&&!raf)raf=requestAnimationFrame(draw)}
  function locate(e){if(e.pointerType==='touch')return;px=e.clientX;py=e.clientY;active=true;schedule()}
  function leave(){active=false;if(raf)cancelAnimationFrame(raf);raf=0;lens.hidden=true;rect=null}
  function invalidate(){rect=null;schedule()}
  g.addEventListener('pointerenter',e=>{rect=null;locate(e)});
  g.addEventListener('pointermove',locate,{passive:true});g.addEventListener('pointerleave',leave);
  img.addEventListener('load',invalidate);window.addEventListener('resize',invalidate,{passive:true});
  const dialog=g.closest('dialog');dialog?.addEventListener('scroll',invalidate,{passive:true});
  const cleanup=new MutationObserver(()=>{if(g.isConnected)return;leave();window.removeEventListener('resize',invalidate);dialog?.removeEventListener('scroll',invalidate);cleanup.disconnect()});
  cleanup.observe(dialog||g.parentNode,{childList:true,subtree:true});
 });
}
new MutationObserver(update).observe(document.body,{childList:true,subtree:true});update();
})();