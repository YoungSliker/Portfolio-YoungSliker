// Stable entry points shared with the new portfolio; reuse the existing pages.
(() => {
 const key=new URLSearchParams(location.search).get('work');
 const projects={mine:'mine-eco',lingsu:'weiyuan',suiyuan:'suiyuan'};
 if(!Object.hasOwn(projects,key)&&!['arti','earthquake'].includes(key))return;
 let observer;
 const open=()=>{
  if(typeof window.showPage!=='function')return false;
  window.showPage('aigc');
  if(projects[key]){if(typeof window.openProject!=='function')return false;window.openProject(projects[key]);return true;}
  const token=key==='arti'?'ARTI':'小马博士';
  const tile=Array.from(document.querySelectorAll('#aigc-drift-root [role="button"]')).find(el=>(el.getAttribute('aria-label')||'').includes(token));
  if(!tile)return false;
  tile.click();return true;
 };
 window.addEventListener('load',()=>{
  if(open())return;
  observer=new MutationObserver(()=>{if(open())observer.disconnect();});
  observer.observe(document.getElementById('aigc-drift-root')||document.body,{childList:true,subtree:true});
  setTimeout(()=>observer.disconnect(),15000);
 },{once:true});
})();
