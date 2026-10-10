/* Run against the local site: node js/export-static-ui-901.cjs [base URL].
   Requires Playwright and Sharp in the development environment only. */
const { chromium } = require('playwright');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, '主界面', 'mobile-static', '901');
const base = process.argv[2] || 'http://127.0.0.1:8765/';

(async () => {
 fs.mkdirSync(output, {recursive:true});
 const browser = await chromium.launch({channel:process.env.STATIC_UI_BROWSER || 'msedge',headless:true});
 const page = await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 // Export from the live desktop source, never from a previous raster layer.
 await page.route('**/*mobile-static-90*', r => r.fulfill({body:'',contentType:r.request().url().includes('.css')?'text/css':'text/javascript'}));
 await page.goto(base, {waitUntil:'load'});
 await page.evaluate(()=>document.fonts.ready);
 await page.addStyleTag({content:`
  *,*::before,*::after {transition:none!important;animation:none!important;caret-color:transparent!important}
  .target-cursor-wrapper,#tooltip {display:none!important}
  :focus {outline:none!important}
  .bg12-art-text {width:calc(18ch - 15px)!important;opacity:1!important;border-right-color:transparent!important}
  .bg12-three-squares .bg12-square-unit,.bg12-left-decor-square,.bg12-line-mask,#bg12-img-02,.home-dot-matrix {opacity:1!important;filter:none!important}
  .home-depth-text__stage {transform:none!important}
  .profile-particle-text__fallback {opacity:1!important}
  .profile-particle-text__canvas {display:none!important}
  .scroll-stack-card {transform:none!important;filter:none!important}
  [data-export-ancestor]::before,[data-export-ancestor]::after {opacity:0!important}
  html body [data-export-hidden] {display:none!important;opacity:0!important;visibility:hidden!important}
 `});
 const manifest = {};

 async function capture(name, selector, {hide=[],css='',padding=0,hotspots=''}={}) {
  const style=await page.addStyleTag({content:css||'/* native dimensions */'});
  await page.evaluate(({selector,hide})=>{
   const target=document.querySelector(selector);
   if(!target)throw new Error('Missing export target: '+selector);
   window.__exportRestore=[];
   const change=(el,values)=>{
    window.__exportRestore.push([el,el.getAttribute('style')]);
    for(const [key,value] of Object.entries(values))el.style.setProperty(key,value,'important');
   };
   change(target,{opacity:'1',visibility:'visible',transform:'none'});
   const exclude=el=>{
    el.setAttribute('data-export-hidden','');
    change(el,{display:'none',opacity:'0',visibility:'hidden'});
   };
   hide.forEach(sel=>document.querySelectorAll(sel).forEach(exclude));
   for(let child=target,parent=child.parentElement;parent;child=parent,parent=parent.parentElement){
    for(const sibling of parent.children)if(sibling!==child)exclude(sibling);
    parent.setAttribute('data-export-ancestor','');
    change(parent,{opacity:'1',visibility:'visible',background:'transparent','box-shadow':'none','border-color':'transparent',filter:'none','backdrop-filter':'none',overflow:'visible',transform:'none',perspective:'none'});
   }
  },{selector,hide});
  const data=await page.evaluate(({selector,hotspots,padding})=>{
   const root=document.querySelector(selector),r=root.getBoundingClientRect();
   const clip={x:Math.max(0,Math.floor(r.x-padding)),y:Math.max(0,Math.floor(r.y-padding)),width:Math.ceil(r.width+padding*2),height:Math.ceil(r.height+padding*2)};
   clip.width=Math.min(clip.width,innerWidth-clip.x);clip.height=Math.min(clip.height,innerHeight-clip.y);
   const hits=hotspots?[...root.querySelectorAll(hotspots)].map((el,index)=>{
    const b=el.getBoundingClientRect();
    return {index,label:el.getAttribute('aria-label')||el.textContent.trim(),x:(b.x-r.x)/r.width,y:(b.y-r.y)/r.height,width:b.width/r.width,height:b.height/r.height};
   }):[];
   return {clip,box:{width:r.width,height:r.height},inset:{left:(clip.x-r.x)/r.width,top:(clip.y-r.y)/r.height,width:clip.width/r.width,height:clip.height/r.height},hits};
  },{selector,hotspots,padding});
  const png=await page.screenshot({clip:data.clip,omitBackground:true});
  const stats=await sharp(png).stats();
  if(stats.channels.at(-1).max===0)throw new Error('Empty transparent export: '+name);
  if(stats.channels.length!==4||stats.channels[3].min===255)throw new Error('Opaque background leaked into: '+name);
  await sharp(png).webp({quality:96,alphaQuality:100,effort:6}).toFile(path.join(output,name+'.webp'));
  manifest[name]={file:name+'.webp',...data};
  await page.evaluate(()=>{
   for(const [el,style] of window.__exportRestore.reverse())style===null?el.removeAttribute('style'):el.setAttribute('style',style);
   document.querySelectorAll('[data-export-ancestor]').forEach(el=>el.removeAttribute('data-export-ancestor'));
   document.querySelectorAll('[data-export-hidden]').forEach(el=>el.removeAttribute('data-export-hidden'));
  });
  await style.evaluate(el=>el.remove());
  console.log('Exported',name,data.clip.width+'x'+data.clip.height);
 }

 try {
  await page.waitForTimeout(1200);
  await capture('home-foreground','#bg12-content',{
   hide:['#bg12-video','#bg12-dot-layer','.bg12-video-loading-mask','#bg13-img','.profile-info-html','#imagesDiv'],padding:150,
   css:'html body #home #bg-3d-wrapper:not(.expanded-bg13){left:179px!important;top:210px!important;transform:none!important} #bg12-content{transform:none!important}'
  });
  await page.evaluate(()=>window.handleBg12Click());
  await page.waitForTimeout(1400);
  await capture('profile-art','#bg13-img',{
   hide:['.profile-info-title'],
   css:'#bg-3d-wrapper.expanded-bg13{left:32px!important;top:40px!important;width:1856px!important;height:988px!important} #bg13-img{transform:none!important}'
  });
  await page.evaluate(()=>{
   const signature=document.createElement('div');
   signature.id='static-export-signature';
   signature.style.cssText='position:fixed;left:560px;top:960px;width:800px;height:80px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;color:#e5e7eb;font:300 28px/1.2 system-ui,sans-serif;letter-spacing:2px;white-space:nowrap';
   const line=document.createElement('div');
   line.textContent=document.querySelector('[data-particle-text]').dataset.particleText+document.querySelector('.profile-identity-text').textContent;
   const mark=document.createElement('small');
   mark.textContent=document.querySelector('#home>.bottom-10>.animate-pulse').textContent;
   mark.style.cssText='font-size:14px;letter-spacing:7px;opacity:.5';
   signature.append(line,mark);document.body.append(signature);
  });
  await capture('profile-signature','#static-export-signature');
  await page.evaluate(()=>document.getElementById('static-export-signature').remove());
  await capture('profile-tools','#imagesDiv',{
   css:'html body #bg-3d-wrapper.expanded-bg13 #imagesDiv{left:900px!important;right:auto!important;top:720px!important;bottom:auto!important;width:700px!important;height:108px!important;transform:none!important;filter:none!important} .profile-logoloop{mask-image:none!important;-webkit-mask-image:none!important} .logoloop__track{transform:none!important} .logoloop__list:not(:first-child){display:none!important}',
   hotspots:'.logoloop__list:first-child a'
  });
  await page.evaluate(()=>document.getElementById('youngNavToggle').click());
  await page.waitForTimeout(400);
  await capture('works-heading','.young-nav577__intro');
  for(let i=0;i<3;i++)await capture('works-card-'+i,`.young-nav577__card:nth-child(${i+1})`,{hotspots:'button[data-nav-page]'});
  await page.evaluate(()=>{document.getElementById('youngNavToggle').click();window.showPage('aigc');});
  await page.waitForSelector('#aigc .category-stack-heading');
  await page.waitForTimeout(800);
  await capture('aigc-heading','#aigc .category-stack-heading');
  for(let i=0;i<3;i++){
   await capture('aigc-card-'+i,`#aigc .scroll-stack-card:nth-of-type(${i+1}) .card-base`,{
    css:`#aigc .scroll-stack-card:nth-of-type(${i+1}){position:fixed!important;left:388px!important;top:260px!important;width:1144px!important;height:560px!important;transform:none!important} #aigc .card-base{transform:none!important}`
   });
  }
  await page.evaluate(()=>window.showPage('creative'));
  await page.waitForSelector('#creative .ap-content');
  await page.waitForTimeout(800);
  await capture('creative-heading','#creative .category-stack-heading');
  for(let i=0;i<2;i++)await capture('creative-card-'+i,`#creative .${i?'ap-card':'td-card'}`,{
   hide:['.td-wave-backdrop','.td-card-scrim','.ap-terminal','.ap-shade'],
   css:`#creative .scroll-stack-card:nth-of-type(${i+1}){position:fixed!important;left:388px!important;top:260px!important;width:1144px!important;height:560px!important;transform:none!important} #creative .card-base{background:transparent!important;box-shadow:none!important;transform:none!important}`
  });
  fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
