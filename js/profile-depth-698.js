(function () {
    'use strict';

    const wrapper = document.getElementById('bg-3d-wrapper');
    const stage = document.getElementById('bg12-content');
    const info = document.querySelector('.profile-info-html');
    if (!wrapper || !stage || !info) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const spring = { x: 0, y: 0, scale: 1, vx: 0, vy: 0, vs: 0, tx: 0, ty: 0, ts: 1 };
    let tiltFrame = 0;

    const setTransform = () => {
        stage.style.setProperty('--profile-tilt-x', spring.x.toFixed(3) + 'deg');
        stage.style.setProperty('--profile-tilt-y', spring.y.toFixed(3) + 'deg');
        stage.style.setProperty('--profile-tilt-scale', spring.scale.toFixed(4));
        stage.style.setProperty('--profile-info-x', (spring.y * 2.5).toFixed(2) + 'px');
        stage.style.setProperty('--profile-info-y', (-spring.x * 2.5).toFixed(2) + 'px');
        stage.style.setProperty('--profile-tools-x', (spring.y * 8.2).toFixed(2) + 'px');
        stage.style.setProperty('--profile-tools-y', (-spring.x * 8.2).toFixed(2) + 'px');
        stage.style.setProperty('--profile-particle-x', (spring.y * 4.6).toFixed(2) + 'px');
        stage.style.setProperty('--profile-particle-y', (-spring.x * 4.6).toFixed(2) + 'px');
    };

    const tickTilt = () => {
        const stiffness = 0.075;
        const damping = 0.76;
        spring.vx = (spring.vx + (spring.tx - spring.x) * stiffness) * damping;
        spring.vy = (spring.vy + (spring.ty - spring.y) * stiffness) * damping;
        spring.vs = (spring.vs + (spring.ts - spring.scale) * stiffness) * damping;
        spring.x += spring.vx;
        spring.y += spring.vy;
        spring.scale += spring.vs;
        setTransform();
        const moving = Math.abs(spring.tx - spring.x) + Math.abs(spring.ty - spring.y) + Math.abs(spring.ts - spring.scale) > 0.002;
        tiltFrame = moving ? requestAnimationFrame(tickTilt) : 0;
    };

    const wakeTilt = () => {
        if (!tiltFrame && !reducedMotion) tiltFrame = requestAnimationFrame(tickTilt);
    };

    const resetPointerDepth = () => {
        spring.tx = 0;
        spring.ty = 0;
        spring.ts = 1;
        wakeTilt();
    };

    document.addEventListener('pointermove', (event) => {
        if (!wrapper.classList.contains('expanded-bg13') || reducedMotion) return;
        const rect = wrapper.getBoundingClientRect();
        const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
        if (!inside) {
            resetPointerDepth();
            return;
        }
        const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width) * 2 - 1));
        const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height) * 2 - 1));
        spring.tx = -ny * 4.2;
        spring.ty = nx * 5.4;
        spring.ts = 1.006;
        wakeTilt();
    }, { passive: true });

    document.addEventListener('pointerleave', resetPointerDepth);
    window.addEventListener('blur', resetPointerDepth);

    const computeCenterOrder = (length) => {
        const order = [];
        if (length <= 0) return order;
        const middle = Math.floor(length / 2);
        let offset = 0;
        while (order.length < length) {
            if (offset % 2 === 0) {
                const index = middle + offset / 2;
                if (index >= 0 && index < length) order.push(index);
            } else {
                const index = middle - Math.ceil(offset / 2);
                if (index >= 0 && index < length) order.push(index);
            }
            offset += 1;
        }
        return order.slice(0, length);
    };

    const states = Array.from(info.querySelectorAll('p > span, p > strong')).map((node) => {
        const original = node.textContent || '';
        const availableChars = Array.from(new Set(Array.from(original))).filter((char) => char !== ' ');
        node.textContent = '';
        node.classList.add('decrypted-text-parent');
        node.setAttribute('aria-label', original);

        const visual = document.createElement('span');
        visual.className = 'decrypted-text-visual';
        visual.setAttribute('aria-hidden', 'true');

        const slots = Array.from(original, (char) => {
            const slot = document.createElement('span');
            slot.className = 'decrypted-text-char is-revealed';
            const measure = document.createElement('span');
            measure.className = 'decrypted-text-measure';
            measure.textContent = char;
            const current = document.createElement('span');
            current.className = 'decrypted-text-current';
            current.textContent = char;
            slot.append(measure, current);
            visual.appendChild(slot);
            return { slot, current, original: char };
        });
        node.appendChild(visual);
        return { node, original, availableChars, slots, order: computeCenterOrder(original.length) };
    });

    const randomOriginalChar = (state) => {
        if (!state.availableChars.length) return '';
        return state.availableChars[Math.floor(Math.random() * state.availableChars.length)];
    };

    let hasAnimated = false;
    const timers = new Set();
    const schedule = (callback, delay) => {
        const timer = window.setTimeout(() => {
            timers.delete(timer);
            callback();
        }, delay);
        timers.add(timer);
    };

    const animateState = (state, delay) => {
        const revealed = new Set();
        state.slots.forEach(({ slot, current, original }) => {
            slot.classList.remove('is-revealed');
            slot.classList.add('is-encrypted');
            current.textContent = original === ' ' ? ' ' : randomOriginalChar(state);
        });

        schedule(() => {
            let pointer = 0;
            const interval = window.setInterval(() => {
                state.slots.forEach(({ current, original }, index) => {
                    if (!revealed.has(index) && original !== ' ') current.textContent = randomOriginalChar(state);
                });

                if (pointer < state.order.length) {
                    const index = state.order[pointer++];
                    const character = state.slots[index];
                    revealed.add(index);
                    character.current.textContent = character.original;
                    character.slot.classList.remove('is-encrypted');
                    character.slot.classList.add('is-revealed');
                }

                if (pointer >= state.order.length) {
                    window.clearInterval(interval);
                    state.slots.forEach(({ slot, current, original }) => {
                        current.textContent = original;
                        slot.classList.remove('is-encrypted');
                        slot.classList.add('is-revealed');
                    });
                }
            }, 50);
        }, delay);
    };

    const triggerViewDecrypt = () => {
        if (hasAnimated) return;
        hasAnimated = true;
        if (reducedMotion) return;
        states.forEach((state, index) => animateState(state, 120 + index * 45));
    };

    let wasExpanded = wrapper.classList.contains('expanded-bg13');
    new MutationObserver(() => {
        const expanded = wrapper.classList.contains('expanded-bg13');
        if (expanded && !wasExpanded) triggerViewDecrypt();
        if (!expanded && wasExpanded) {
            spring.tx = spring.ty = 0;
            spring.ts = 1;
            wakeTilt();
        }
        wasExpanded = expanded;
    }).observe(wrapper, { attributes: true, attributeFilter: ['class'] });

    if (wasExpanded) triggerViewDecrypt();
})();
/* 624: grouped physics with drag + on-demand interactive Particle Text */
(function(){
'use strict';
const wrapper=document.getElementById('bg-3d-wrapper'),stage=document.getElementById('bg12-content'),title=document.querySelector('.profile-info-title'),info=document.querySelector('.profile-info-html'),footer=document.getElementById('textDiv');
if(!wrapper||!stage||!title||!info)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,TEXT='探索AI、创意与交互的边界';
const COLOR_PALETTES=[['#ff2bd6','#19f7ff'],['#b517ff','#00f5c8'],['#ff4f87','#35c8ff'],['#ff00a8','#00cfff'],['#ff5c8a','#6c63ff'],['#9325f5','#ff861f'],['#00b89c','#9747ff'],['#f52e98','#20c879'],['#6045ef','#20d5c5'],['#ed42c5','#a34dff'],['#008fc7','#20c997']];let lastPalette=-1;let running=false,fallRaf=0,particleRaf=0,resetTimer=0;
let interactionReady=false,preparing=false,readyToken=0,readyTimer=0;
function waitForImage(img){if(img.complete&&img.naturalWidth>0)return Promise.resolve();return new Promise(resolve=>{let done=false;const finish=()=>{if(done)return;done=true;clearTimeout(timer);img.removeEventListener('load',finish);img.removeEventListener('error',finish);resolve()};const timer=setTimeout(finish,3500);img.addEventListener('load',finish,{once:true});img.addEventListener('error',finish,{once:true})})}
async function prepareInteraction(token){const images=Array.from(wrapper.querySelectorAll('img'));const fontReady=document.fonts&&document.fonts.ready?document.fonts.ready.catch(()=>{}):Promise.resolve();await Promise.all([fontReady,...images.map(waitForImage)]);if(token!==readyToken||!wrapper.classList.contains('expanded-bg13'))return;await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));if(token!==readyToken||!wrapper.classList.contains('expanded-bg13'))return;clearTimeout(readyTimer);readyTimer=setTimeout(()=>{if(token!==readyToken||!wrapper.classList.contains('expanded-bg13'))return;readyTimer=0;interactionReady=true;wrapper.classList.add('profile-falling-ready')},900)}
function startPreparing(){const token=++readyToken;preparing=true;prepareInteraction(token).finally(()=>{if(token===readyToken)preparing=false})}
function syncInteractionReady(){if(wrapper.classList.contains('expanded-bg13')){if(!interactionReady&&!preparing&&!readyTimer)startPreparing()}else{readyToken++;preparing=false;clearTimeout(readyTimer);readyTimer=0;interactionReady=false;wrapper.classList.remove('profile-falling-ready')}}
new MutationObserver(syncInteractionReady).observe(wrapper,{attributes:true,attributeFilter:['class']});syncInteractionReady();
function groupSources(){const list=[{node:title,text:(title.textContent||'').trim(),title:true}];info.querySelectorAll('p > span, p > strong').forEach(node=>{const text=(node.getAttribute('aria-label')||node.textContent||'').trim();if(text)list.push({node,text,title:false})});return list}
function bindDrag(body){
 const el=body.el;
 el.addEventListener('pointerdown',event=>{event.preventDefault();if(body.wake)body.wake();body.dragging=true;body.dragX=event.clientX-body.x;body.dragY=event.clientY-body.y;body.lastX=event.clientX;body.lastY=event.clientY;body.lastT=performance.now();body.vx=0;body.vy=0;el.classList.add('is-dragging');el.setPointerCapture(event.pointerId)});
 el.addEventListener('pointermove',event=>{if(!body.dragging)return;const now=performance.now(),dt=Math.max(8,now-body.lastT)/1000,nx=event.clientX-body.dragX,ny=event.clientY-body.dragY;body.vx=Math.max(-1100,Math.min(1100,(event.clientX-body.lastX)/dt));body.vy=Math.max(-1100,Math.min(1100,(event.clientY-body.lastY)/dt));body.x=nx;body.y=ny;body.lastX=event.clientX;body.lastY=event.clientY;body.lastT=now});
 const release=event=>{if(!body.dragging)return;body.dragging=false;el.classList.remove('is-dragging');if(el.hasPointerCapture(event.pointerId))el.releasePointerCapture(event.pointerId)};
 el.addEventListener('pointerup',release);el.addEventListener('pointercancel',release);
}
function makeFallingGroups(){
 const overlay=document.createElement('div');overlay.className='profile-falling-overlay';overlay.setAttribute('aria-hidden','true');document.body.appendChild(overlay);
 const bodies=groupSources().map((item,index)=>{const rect=item.node.getBoundingClientRect(),style=getComputedStyle(item.node),el=document.createElement('span');el.className='profile-falling-word'+(item.title?' profile-falling-word--title':'');el.textContent=item.text;el.style.fontSize=style.fontSize;el.style.fontFamily=style.fontFamily;el.style.fontWeight=style.fontWeight;el.style.letterSpacing=style.letterSpacing;overlay.appendChild(el);const side=index%2===0?-1:1,body={el,x:rect.left,y:rect.top,homeX:rect.left,homeY:rect.top,w:Math.max(rect.width,el.offsetWidth),h:Math.max(rect.height,el.offsetHeight),vx:side*(150+Math.random()*330)+(Math.random()-.5)*110,vy:-150-Math.random()*245,angle:0,va:(Math.random()-.5)*3.2,bounce:.44+Math.random()*.2,dragging:false};bindDrag(body);return body});
 let previous=performance.now(),sleepFrames=0;
 function frame(now){
  const dt=Math.min(.032,(now-previous)/1000);previous=now;const width=innerWidth,height=innerHeight-18;
  bodies.forEach(body=>{if(!body.dragging){body.vy+=900*dt;body.x+=body.vx*dt;body.y+=body.vy*dt;body.angle+=body.va*dt}if(body.x<0){body.x=0;body.vx=Math.abs(body.vx)*.7}if(body.x+body.w>width){body.x=width-body.w;body.vx=-Math.abs(body.vx)*.7}if(body.y<0){body.y=0;body.vy=Math.abs(body.vy)*.55}if(body.y+body.h>height){body.y=height-body.h;body.vy=-Math.abs(body.vy)*body.bounce;body.vx*=.91;body.va*=.85;if(Math.abs(body.vy)<12)body.vy=0}});
  for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){const a=bodies[i],b=bodies[j];if(a.dragging||b.dragging)continue;const ox=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),oy=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);if(ox>0&&oy>0){if(ox<oy){const push=ox/2+.5;if(a.x<b.x){a.x-=push;b.x+=push}else{a.x+=push;b.x-=push}const v=a.vx;a.vx=b.vx*.68;b.vx=v*.68}else{const push=oy/2+.5;if(a.y<b.y){a.y-=push;b.y+=push}else{a.y+=push;b.y-=push}const v=a.vy;a.vy=b.vy*.58;b.vy=v*.58}}}
   bodies.forEach(body=>{body.el.style.transform='translate3d('+body.x.toFixed(2)+'px,'+body.y.toFixed(2)+'px,0) rotate('+body.angle.toFixed(3)+'rad)'});
   const moving=bodies.some(body=>body.dragging||Math.abs(body.vx)>4||Math.abs(body.vy)>4||Math.abs(body.va)>.035);sleepFrames=moving?0:sleepFrames+1;if(sleepFrames>30){fallRaf=0;return}fallRaf=requestAnimationFrame(frame);
  }
  const wake=()=>{sleepFrames=0;if(!fallRaf){previous=performance.now();fallRaf=requestAnimationFrame(frame)}};bodies.forEach(body=>body.wake=wake);wake();return {overlay,bodies,returnHome(){cancelAnimationFrame(fallRaf);fallRaf=0;overlay.classList.add('is-returning');void overlay.offsetWidth;bodies.forEach(body=>{body.dragging=false;body.el.classList.remove('is-dragging');body.el.style.transform='translate3d('+body.homeX.toFixed(2)+'px,'+body.homeY.toFixed(2)+'px,0) rotate(0rad)'});return new Promise(resolve=>setTimeout(resolve,850))}};
}
function makeParticleStage(){
 particleRaf=0;
 let paletteIndex=Math.floor(Math.random()*COLOR_PALETTES.length);if(paletteIndex===lastPalette)paletteIndex=(paletteIndex+1)%COLOR_PALETTES.length;lastPalette=paletteIndex;const palette=COLOR_PALETTES[paletteIndex];
 const host=document.createElement('div');host.className='profile-particle-stage';host.setAttribute('aria-label',TEXT);const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');host.appendChild(canvas);stage.appendChild(host);
 const rect=host.getBoundingClientRect(),width=Math.max(1,Math.floor(host.clientWidth)),height=Math.max(1,Math.floor(host.clientHeight)),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.floor(width*dpr);canvas.height=Math.floor(height*dpr);
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);const off=document.createElement('canvas');off.width=width;off.height=height;const oc=off.getContext('2d',{willReadFrequently:true}),footerStyle=getComputedStyle(document.getElementById('mainText')),family=footerStyle.fontFamily||'sans-serif',weight=footerStyle.fontWeight||'500';
 oc.fillStyle=palette[0];oc.textBaseline='middle';oc.textAlign='center';const capSize=Math.min(height*.16,82);oc.font=weight+' '+capSize+'px '+family;oc.fillText('探索 AI',width*.5,height*.25);const heroSize=Math.min(height*.27,136);oc.font=weight+' '+heroSize+'px '+family;oc.fillText('创意 × 交互',width*.5,height*.52);const tailSize=Math.min(height*.18,92);oc.font=weight+' '+tailSize+'px '+family;oc.fillText('的边界',width*.5,height*.78);oc.strokeStyle=palette[0];oc.lineWidth=Math.max(4,capSize*.05);const diamond=(x,y,r)=>{oc.beginPath();oc.moveTo(x,y-r);oc.lineTo(x+r,y);oc.lineTo(x,y+r);oc.lineTo(x-r,y);oc.closePath();oc.stroke()};diamond(width*.13,height*.52,Math.min(width*.035,height*.12));diamond(width*.87,height*.52,Math.min(width*.035,height*.12)); const pixels=oc.getImageData(0,0,width,height).data,particles=[];for(let y=0;y<height;y+=5)for(let x=0;x<width;x+=5)if(pixels[(y*width+x)*4+3]>90){const seed=Math.random();particles.push({tx:x,ty:y,x, y, sx:x,sy:y,seed,depth:.45+Math.random()*.9,delay:0,size:3.5+Math.random()*.8})}
 const pointer={active:false,x:width/2,y:height/2,sx:width/2,sy:height/2};let gathering=false,gatherStart=0,settleUntil=0;
 function startGather(scatter){const now=performance.now();particles.forEach(p=>{if(scatter&&!reduced){const angle=p.seed*Math.PI*2,distance=180*(.35+p.depth*.75);p.x=p.tx+Math.cos(angle)*distance+(p.depth-.8)*65;p.y=p.ty+Math.sin(angle)*distance+(p.seed-.5)*65}p.sx=p.x;p.sy=p.y;p.delay=reduced?0:p.seed*420});gatherStart=now;gathering=true;ensureRender()}
 function ensureRender(){if(!particleRaf)particleRaf=requestAnimationFrame(render)}
 function render(now){
  ctx.clearRect(0,0,width,height);pointer.sx+=(pointer.x-pointer.sx)*.18;pointer.sy+=(pointer.y-pointer.sy)*.18;let complete=true,maxDelta=0;
  particles.forEach(p=>{let bx=p.tx,by=p.ty;if(gathering){const progress=Math.max(0,Math.min(1,(now-gatherStart-p.delay)/(reduced?1:1350))),eased=1-Math.pow(1-progress,3);bx=p.sx+(p.tx-p.sx)*eased;by=p.sy+(p.ty-p.sy)*eased;if(progress<1)complete=false}else if(!reduced&&pointer.active){bx+=Math.sin(now*.0009+p.seed*10)*.55*p.depth;by+=Math.cos(now*.00075+p.depth*10)*.55*p.depth}if(pointer.active&&!reduced){const dx=bx-pointer.sx,dy=by-pointer.sy,d=Math.hypot(dx,dy);if(d>0&&d<120){const force=Math.pow(1-d/120,2)*42;bx+=dx/d*force;by+=dy/d*force}}p.x+=(bx-p.x)*.23;p.y+=(by-p.y)*.23;maxDelta=Math.max(maxDelta,Math.abs(bx-p.x)+Math.abs(by-p.y));ctx.fillStyle=p.seed>.62?palette[1]:palette[0];ctx.fillRect(p.x,p.y,p.size,p.size)});
  if(gathering&&complete)gathering=false;const keep=gathering||pointer.active||now<settleUntil||maxDelta>.35;if(keep)particleRaf=requestAnimationFrame(render);else particleRaf=0;
 }
 function locate(event){const r=canvas.getBoundingClientRect();pointer.x=(event.clientX-r.left)*width/r.width;pointer.y=(event.clientY-r.top)*height/r.height}
 host.addEventListener('pointerenter',event=>{locate(event);pointer.active=true;ensureRender()});
 host.addEventListener('pointermove',event=>{locate(event);pointer.active=true;ensureRender()},{passive:true});
 host.addEventListener('pointerleave',()=>{pointer.active=false;settleUntil=performance.now()+650;ensureRender()});
 startGather(true);requestAnimationFrame(()=>host.classList.add('is-visible'));
 return host;
}
function trigger(event){
 if(running||reduced||!interactionReady||!wrapper.classList.contains('expanded-bg13'))return;running=true;clearTimeout(resetTimer);
 if(footer)footer.classList.add('profile-footer-hidden');
 const falling=makeFallingGroups();wrapper.classList.add('profile-falling-active');const particleStage=makeParticleStage();
 const initialRect=particleStage.getBoundingClientRect();let inside=!!event&&event.clientX>=initialRect.left&&event.clientX<=initialRect.right&&event.clientY>=initialRect.top&&event.clientY<=initialRect.bottom;let hasEntered=inside,finished=false,aborted=false;
 const abort=()=>{aborted=true;finished=true;clearTimeout(resetTimer);cancelAnimationFrame(particleRaf);cancelAnimationFrame(fallRaf);particleRaf=fallRaf=0;document.removeEventListener('pointermove',monitorPointer);window.removeEventListener('portfolio-page-change',onPage);particleStage.remove();falling.overlay.remove();wrapper.classList.remove('profile-returning','profile-falling-active');footer?.classList.remove('profile-footer-hidden');running=false};
 const onPage=e=>{if(e.detail!=='home')abort()};
 window.addEventListener('portfolio-page-change',onPage);
 const finish=()=>{if(finished)return;finished=true;clearTimeout(resetTimer);document.removeEventListener('pointermove',monitorPointer);cancelAnimationFrame(particleRaf);particleRaf=0;particleStage.remove();wrapper.classList.add('profile-returning');falling.returnHome().then(()=>{window.removeEventListener('portfolio-page-change',onPage);if(aborted)return;falling.overlay.remove();wrapper.classList.remove('profile-returning','profile-falling-active');if(footer)footer.classList.remove('profile-footer-hidden');running=false})};
 const scheduleFinish=()=>{clearTimeout(resetTimer);resetTimer=setTimeout(finish,1000)};
 const monitorPointer=moveEvent=>{const rect=particleStage.getBoundingClientRect(),nextInside=moveEvent.clientX>=rect.left&&moveEvent.clientX<=rect.right&&moveEvent.clientY>=rect.top&&moveEvent.clientY<=rect.bottom;if(nextInside){hasEntered=true;clearTimeout(resetTimer)}else if(hasEntered&&inside){scheduleFinish()}inside=nextInside};
 document.addEventListener('pointermove',monitorPointer,{passive:true});
}
title.addEventListener('pointerenter',trigger);info.addEventListener('pointerenter',trigger);
})();






