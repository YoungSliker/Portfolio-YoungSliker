(()=>{
 const detail=document.getElementById('mine-eco-detail');if(!detail)return;
 const baseOpen=window.openProject;
 const cover=detail.querySelector('.mine-video-cover');
 const videoFrame=detail.querySelector('.mine-eco__video-shell iframe');
 const resetButton=detail.querySelector('[data-mine-video-reset]');
 function resetVideo(){videoFrame.removeAttribute('src');videoFrame.hidden=true;cover.hidden=false;if(resetButton)resetButton.hidden=true;}
 cover.addEventListener('click',()=>{videoFrame.src=videoFrame.dataset.src;videoFrame.hidden=false;cover.hidden=true;if(resetButton)resetButton.hidden=false;});
 if(resetButton)resetButton.addEventListener('click',resetVideo);
 const yearWatermark=document.createElement('div');
 yearWatermark.className='mine-eco__year-watermark';yearWatermark.textContent='2023';yearWatermark.setAttribute('aria-hidden','true');detail.appendChild(yearWatermark);
 const gradual=document.createElement('div');gradual.className='mine-eco__gradual-blur';gradual.setAttribute('aria-hidden','true');
 const blurValues=[.08,.16,.3,.5,.85,1.3,2,3];
 blurValues.forEach((blur,i)=>{const layer=document.createElement('i');layer.style.setProperty('--blur',blur+'rem');layer.style.setProperty('--p1',(i*9)+'%');layer.style.setProperty('--p2',Math.min(100,i*9+30)+'%');gradual.appendChild(layer)});detail.appendChild(gradual);

 function openMine(){
  resetVideo();
  document.body.classList.add('is-project-open','is-mine-eco-open');detail.style.display='block';detail.scrollTop=0;document.body.style.overflow='hidden';
  detail.classList.remove('is-title-ready');requestAnimationFrame(()=>{detail.classList.add('is-title-ready');window.dispatchEvent(new Event('mine-eco-open')); detail.querySelectorAll('.mine-eco__reveal').forEach((el,i)=>{if(i<2)el.classList.add('is-visible')})})
 }
 window.openProject=function(id){if(id==='mine-eco'){openMine();return}if(typeof baseOpen==='function')baseOpen(id)};
 window.closeMineProject=function(){resetVideo();detail.style.display='none';document.body.classList.remove('is-mine-eco-open','is-project-open');document.body.style.overflow='hidden';detail.classList.remove('is-title-ready');detail.querySelectorAll('.mine-eco__reveal').forEach(el=>el.classList.remove('is-visible'));closeLightbox();window.dispatchEvent(new Event('mine-eco-close'));yearWatermark.style.opacity='0';gradual.classList.remove('is-visible')};

 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');}}),{root:detail,threshold:.12});detail.querySelectorAll('.mine-eco__reveal').forEach(el=>observer.observe(el));
 const lightbox=detail.querySelector('.mine-eco__lightbox'),lightboxImg=lightbox&&lightbox.querySelector('img');
 function closeLightbox(){if(lightbox)lightbox.classList.remove('is-open')}
 detail.querySelectorAll('.mine-eco__shot,.mine-eco__mine-shot,.mine-eco__bounce-card').forEach(shot=>shot.addEventListener('click',()=>{if(!lightbox||!lightboxImg)return;lightboxImg.src=shot.querySelector('img').src;lightboxImg.alt=shot.querySelector('img').alt;lightbox.classList.add('is-open')}));

 detail.addEventListener('click',e=>{const img=e.target.closest('#mine-bounce-root img');if(img&&lightbox){lightboxImg.src=img.src;lightboxImg.alt=img.alt;lightbox.classList.add('is-open')}});
 if(lightbox)lightbox.addEventListener('click',closeLightbox);document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(lightbox&&lightbox.classList.contains('is-open'))closeLightbox();else if(detail.style.display==='block')window.closeMineProject()});
 detail.addEventListener('scroll',()=>{
  const y=detail.scrollTop,viewport=innerHeight;
  const heroImg=detail.querySelector('.mine-eco__hero-media img');if(heroImg&&y<viewport)heroImg.style.transform='translate3d(0,'+(y*.12)+'px,0) scale(1.055)';
  const enter=Math.max(0,Math.min(1,(y-viewport*.34)/(viewport*.62))),fade=Math.max(0,Math.min(1,(detail.scrollHeight-y-viewport)/(viewport*.8)));
  yearWatermark.style.opacity=String(enter*fade*.62);yearWatermark.style.transform='translate(-50%,'+(-42+y*.012)+'%) scale('+(0.86+enter*.18)+')';
  gradual.classList.toggle('is-visible',y>40&&y<detail.scrollHeight-viewport-20);
 },{passive:true});
})();

// Wheel impulses, gravity and damped rebounds; no continuous animation at rest.
(()=>{
 const page=document.getElementById('mine-eco-detail');if(!page)return;
 const layer=document.createElement('div');layer.className='mine-eco__rubble';layer.setAttribute('aria-hidden','true');
 const placements=Array.from({length:24},(_,i)=>[0,0,34+(i%4)*14,0]);
 const outlines=['12,34 34,12 70,16 91,45 77,82 38,91 8,67','8,40 25,15 64,8 88,32 94,65 65,88 22,80','16,24 55,9 83,26 94,59 73,87 32,83 7,56'];
 const random=(min,max)=>min+Math.random()*(max-min);
 const stones=placements.map(([left,top,size,angle],i)=>{
  const el=document.createElement('div');el.className='mine-eco__stone';el.style.cssText=`--left:${left}%;--top:${top}%;--size:${size}px`;
  el.innerHTML=`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="${outlines[i%3]}" fill="#647068" stroke="#a1ac9b" stroke-width=".7"/><path d="M16 32 49 43 70 16 87 46 61 66 38 88 10 64Z" fill="#39463e"/><path d="m16 32 33 11 21-27-36-4Z" fill="#8c9785"/><path d="m49 43 12 23 26-20M49 43 35 76" fill="none" stroke="#a0ab99" stroke-opacity=".5" stroke-width=".7"/></svg>`;
  layer.appendChild(el);return {el,x:0,y:0,vx:0,vy:0,angle,spin:0,initial:angle,mass:Math.pow(size/65,1.35)*random(.8,1.4),inertia:Math.pow(size/65,2)*random(.8,1.5),bounce:random(.14,.43),drag:random(3.4,7),spinDrag:random(2.2,5.2),spring:random(12,24),pending:null};
 });page.appendChild(layer);
 // Jittered cells cover the viewport while maintaining separation.
 function scatter(){
  const mobile=innerWidth<=760,columns=mobile?3:6,rows=4;
  const cellHeight=innerHeight*.8/rows;
  stones.forEach((s,i)=>{
   const col=i%columns,row=Math.floor(i/columns);
   const size=parseFloat(s.el.style.getPropertyValue('--size'))*(mobile?.6:1);
   const bands=mobile?[[.04,.2],[.4,.6],[.8,.96]]:[[.02,.12],[.21,.32],[.37,.47],[.53,.63],[.68,.79],[.88,.98]];
   const band=bands[col];
   const left=Math.max(8,Math.min(innerWidth-size-8,random(...band)*innerWidth-size/2));
   const top=Math.max(70,Math.min(innerHeight-size-18,innerHeight*.12+(row+random(.2,.75))*cellHeight-size/2));
   s.el.style.setProperty('--left',left+'px');s.el.style.setProperty('--top',top+'px');
   const central=left>innerWidth*.2&&left<innerWidth*.8;
   s.el.style.opacity=random(central?.35:.55,central?.7:1).toFixed(2);s.initial=random(-50,50);
  });stop(true);
 }
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0;
 const paint=s=>{s.el.style.transform=`translate3d(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px,0) rotate(${s.angle.toFixed(2)}deg)`};
 function stop(reset=false){cancelAnimationFrame(raf);raf=0;last=0;if(reset)stones.forEach(s=>{s.x=s.y=s.vx=s.vy=s.spin=0;s.angle=s.initial;s.pending=null;paint(s)})}
 function frame(time){
  if(page.style.display!=='block'||document.hidden||reduced.matches){stop();return}
  const dt=Math.min((time-last)/1000||1/60,1/30);last=time;let moving=false;
  stones.forEach(s=>{
   if(s.pending&&time>=s.pending.at){const kick=s.pending;s.vy=Math.max(-420,s.vy-kick.y);s.vx=Math.max(-70,Math.min(70,s.vx+kick.x));s.spin=Math.max(-200,Math.min(200,s.spin+kick.spin));s.pending=null;}
   s.vx+=(-s.x*s.spring-s.vx*s.drag)*dt;s.x+=s.vx*dt;
   if(s.y<0||s.vy<0){s.vy+=1450*dt;s.y+=s.vy*dt;if(s.y>=0){s.y=0;s.vy=Math.abs(s.vy)>65?-s.vy*s.bounce:0;s.spin*=s.bounce+.2}}
   s.angle+=s.spin*dt;s.spin*=Math.exp(-s.spinDrag*dt);
   if(Math.abs(s.x)<.08&&Math.abs(s.vx)<.3){s.x=s.vx=0}if(Math.abs(s.spin)<.2)s.spin=0;
   moving ||= !!s.pending||s.y<0||s.vy!==0||s.vx!==0||s.spin!==0;paint(s);
  });raf=moving?requestAnimationFrame(frame):0;
 }
 page.addEventListener('wheel',event=>{
  if(page.style.display!=='block'||document.hidden||reduced.matches||!event.deltaY||page.querySelector('.mine-eco__lightbox.is-open'))return;
  const amount=Math.min(1,Math.abs(event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?innerHeight:1))/100),dir=Math.sign(event.deltaY);
  stones.forEach(s=>{
   const impulse=(100+amount*130)*random(.55,1.35)/Math.sqrt(s.mass);
   const kick=s.pending||{at:performance.now()+random(0,145),x:0,y:0,spin:0};
   kick.y=Math.min(360,kick.y+impulse);kick.x=Math.max(-65,Math.min(65,kick.x+dir*random(-28,32)/s.mass));
   kick.spin=Math.max(-180,Math.min(180,kick.spin+random(-110,110)/s.inertia));s.pending=kick;
  });
  if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}
 },{passive:true});
 window.addEventListener('mine-eco-open',()=>stop(true));window.addEventListener('mine-eco-close',scatter);
 window.addEventListener('resize',scatter,{passive:true});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop(true)});reduced.addEventListener('change',()=>stop(true));scatter();
})();


(()=>{
 const page=document.getElementById('mine-eco-detail'),loop=page?.querySelector('.mine-eco__tool-strip');if(!loop)return;
 const track=loop.querySelector('.mine-tools-track'),source=track.querySelector('ul'),reduce=matchMedia('(prefers-reduced-motion: reduce)');
 let items=[],width=0,sequence=0,offset=0,last=0,raf=0,visible=false,hover=false,focus=false;
 function paint(){track.style.transform=`translate3d(${-offset}px,0,0)`;items.forEach(({el,center})=>{const x=center-offset;const edge=Math.max(0,Math.min(1,Math.min(x,width-x)/(width*.23)));const ease=edge*edge*(3-2*edge);el.style.setProperty('--edge-scale',(.45+.55*ease).toFixed(3));el.style.setProperty('--edge-opacity',(.18+.82*ease).toFixed(3))})}
 function stop(){cancelAnimationFrame(raf);raf=0;last=0}
 function frame(t){if(!visible||document.hidden||reduce.matches||hover||focus){stop();return}offset=(offset+Math.min((t-last)/1000||0,.05)*46)%sequence;last=t;paint();raf=requestAnimationFrame(frame)}
 function start(){if(!raf&&visible&&!document.hidden&&!reduce.matches&&!hover&&!focus&&sequence){last=performance.now();raf=requestAnimationFrame(frame)}}
 function rebuild(){stop();track.querySelectorAll('[aria-hidden]').forEach(el=>el.remove());width=loop.clientWidth;sequence=source.getBoundingClientRect().width;if(!width||!sequence)return;
  if(!reduce.matches){for(let i=1;i<Math.ceil(width/sequence)+2;i++){const clone=source.cloneNode(true);clone.setAttribute('aria-hidden','true');clone.querySelectorAll('a').forEach(a=>a.tabIndex=-1);track.appendChild(clone)}}
  items=[...track.children].flatMap((list,i)=>[...list.children].map(el=>({el,center:i*sequence+el.offsetLeft-list.offsetLeft+el.offsetWidth/2})));offset%=sequence;paint();start();
 }
 loop.addEventListener('pointerenter',()=>{hover=true;stop()});loop.addEventListener('pointerleave',()=>{hover=false;start()});
 loop.addEventListener('focusin',e=>{focus=true;stop();const item=e.target.closest('li');if(item){offset=Math.max(0,item.offsetLeft-width/2+item.offsetWidth/2);paint()}});
 loop.addEventListener('focusout',()=>{focus=false;start()});
 new ResizeObserver(rebuild).observe(loop);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)rebuild();else stop()},{root:page}).observe(loop);
 window.addEventListener('mine-eco-open',()=>{offset=0;rebuild()});window.addEventListener('mine-eco-close',stop);
 document.addEventListener('visibilitychange',()=>document.hidden?stop():start());reduce.addEventListener('change',rebuild);
})();
