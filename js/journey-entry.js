// Stable entry points shared with the new portfolio; reuse the existing pages.
(() => {
 const key=new URLSearchParams(location.search).get('work');
 const projects={mine:'mine-eco',lingsu:'weiyuan',suiyuan:'suiyuan'};
 const route=/^(visual|app|media|aigc)-(\d+)$/.exec(key||'');
 if(!Object.hasOwn(projects,key)&&!['arti','earthquake'].includes(key)&&!route)return;
 const back=document.createElement('a');
 back.href=route||new URLSearchParams(location.search).get('from')==='graph'?'New/#works':'New/?journeyReturn=1#journey';back.textContent='← 返回新版 · 继续浏览';
 const graphReturn=new URLSearchParams(location.search).get('graphReturn');
 if(graphReturn)back.href='New/?graphReturn='+encodeURIComponent(graphReturn)+'#works';
 back.className='journey-return-link cursor-target';
 back.style.cssText='position:fixed;right:24px;bottom:28px;z-index:2147482990;padding:12px 18px;border:1px solid #827468;border-radius:4px;background:#20201ef2;color:#ffb093;font:14px/1.4 sans-serif;text-decoration:none;box-shadow:0 6px 24px #0004;';
 const placeReturn=()=>{const host=Array.from(document.querySelectorAll('dialog[open]')).at(-1)||document.body;if(back.parentElement!==host)host.appendChild(back);};
 window.addEventListener('DOMContentLoaded',()=>{
  placeReturn();new MutationObserver(placeReturn).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open'],childList:true});
 },{once:true});
 let observer;
 const open=()=>{
  if(typeof window.showPage!=='function')return false;
  if(route&&route[1]!=='aigc'){
   const adapters={visual:['ui','portfolioOpenVisual'],app:['creative','portfolioOpenApp'],media:['creative','portfolioOpenMedia']};
   const [page,api]=adapters[route[1]];
   if(typeof window[api]!=='function')return false;
   window.showPage(page);return window[api](Number(route[2]));
  }
  window.showPage('aigc');
  if(projects[key]){if(typeof window.openProject!=='function')return false;window.openProject(projects[key]);return true;}
  const token=route?window.portfolioAigcTitles?.[Number(route[2])]:key==='arti'?'ARTI':'小马博士';
  if(!token)return false;
  const tile=Array.from(document.querySelectorAll('#aigc-drift-root [role="button"]')).find(el=>(el.getAttribute('aria-label')||'').includes(token));
  if(!tile)return false;
  tile.click();return true;
 };
 const reveal=()=>{
  const loader=document.getElementById('journey-loading');
  if(!document.documentElement.hasAttribute('data-journey-direct'))return;
  loader?.classList.add('is-ready');
  setTimeout(()=>document.documentElement.removeAttribute('data-journey-direct'),matchMedia('(prefers-reduced-motion:reduce)').matches?0:240);
 };
 const start=()=>{
  if(open()){requestAnimationFrame(reveal);return;}
  observer=new MutationObserver(()=>{if(open()){observer.disconnect();requestAnimationFrame(reveal);}});
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(()=>{observer.disconnect();reveal();},15000);
 };
 if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
