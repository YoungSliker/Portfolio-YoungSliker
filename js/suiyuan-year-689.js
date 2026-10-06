(()=>{
const page=document.getElementById('project-detail');if(!page)return;
const year=document.createElement('div');year.className='suiyuan-year-background';year.textContent='2025';year.setAttribute('aria-hidden','true');page.appendChild(year);
const reduced=matchMedia('(prefers-reduced-motion:reduce)');let frame=0;
function update(){frame=0;const visible=getComputedStyle(page).display!=='none';const progress=Math.max(0,Math.min(1,(page.scrollTop-innerHeight*.32)/(innerHeight*.65)));year.style.opacity=visible?String(progress):'0';year.style.transform='translate(-50%,-50%) scale('+(reduced.matches?1:.88+progress*.12)+')'}
function schedule(){if(!frame)frame=requestAnimationFrame(update)}
page.addEventListener('scroll',schedule,{passive:true});new MutationObserver(schedule).observe(page,{attributes:true,attributeFilter:['style','class']});window.addEventListener('resize',schedule);reduced.addEventListener('change',schedule);update();
})();