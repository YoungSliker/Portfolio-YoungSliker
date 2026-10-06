(function(){function e(e,t,n){let r=`数字体验设计/APP设计/助残帮-残障人士特殊群体服务APP/`,i=e.querySelector(`.ax-screen`),a=e.querySelector(`.ax-hotspots`),o=[`首页`,`就业`,`讨论`,`我的`],s=``,c=0,l=[],u={};[...o,`快捷功能`,`我的2`,`首页-下拉`,`文话同传`,`首页-快捷-呼叫求助`,`首页-快捷-呼叫求助2`,`首页-快捷-医院`,`首页-快捷-超市`,`首页-快捷-超市-店铺`,`首页-文章`,`首页-残疾大使`,`首页-残疾大使-张翠翠`].forEach(e=>u[e]=`app/`+e+`.jpg`);for(let e=1;e<=7;e++)u[`引导`+e]=`引导页/引导 (`+e+`).png`;u.就业=`app/就业1.jpg`,u.就业详情=`app/就业.jpg`,[`就业-培训列表`,`就业-简历通关`].forEach(e=>u[e]=`app/`+e+`.jpg`),u.讨论2=`app/讨论2.jpg`;let d={首页:[[0,5,100,4,`首页-下拉`],[52,32,46,18,`首页-文章`],[1,32,48,18,`首页-残疾大使`]],"首页-下拉":[[2,12,23,12,`文话同传`],[27,12,24,12,`首页-快捷-呼叫求助`],[2,34,48,10,`首页-快捷-呼叫求助`],[27,24,24,11,`首页-快捷-医院`]],"首页-快捷-呼叫求助":[[20,66,63,7,`首页-快捷-呼叫求助2`]],"首页-快捷-医院":[[2,15,19,13,`首页-快捷-超市`]],"首页-快捷-超市":[[2,65,94,11,`首页-快捷-超市-店铺`]],"首页-残疾大使":[[2,36,95,16,`首页-残疾大使-张翠翠`]]};d[`首页-下拉`].push([56,12,41,23,`快捷功能`]),d.我的=[[12,29,77,12,`我的2`]],d.我的2=[[77,27,18,9,`我的`]],d.就业=[[0,0,100,90,`就业详情`]],d.就业详情=[[52,36,46,10,`就业-培训列表`],[52,26,46,10,`就业-简历通关`]],d.讨论=[[76,55,21,7,`讨论2`]];function f(e,t,n,r,i,o){let s=document.createElement(`button`);s.className=`study-hit`,s.style.cssText=`left:${e}%;top:${t}%;width:${n}%;height:${r}%`,s.setAttribute(`aria-label`,i),s.onclick=o,a.append(s)}async function p(h,g=!0,_=0){let v=++c;g&&s&&s!==h&&l.push(s),s=h,a.replaceChildren(),i.querySelectorAll(`video`).forEach(e=>{e.pause(),e.remove()}),i.dataset.page=h,i.setAttribute(`aria-busy`,`true`);try{let a=await t(r+u[h]);if(!n()||v!==c)return;let s=a.cloneNode();s.className=`ax-screen-image`,s.alt=`助残帮 · `+h,s.draggable=!1;let g=i.querySelector(`.ax-screen-image`);_&&g&&!matchMedia(`(prefers-reduced-motion: reduce)`).matches?(g.animate([{transform:`translateX(0)`},{transform:`translateX(${-_*100}%)`}],{duration:220}).finished.then(()=>g.remove()),s.animate([{transform:`translateX(${_*100}%)`},{transform:`translateX(0)`}],{duration:220})):g?.remove(),i.querySelector(`.ax-loading`)?.remove(),i.style.setProperty(`--screen-art`,`url(`+JSON.stringify(s.src)+`)`),i.prepend(s),i.setAttribute(`aria-busy`,`false`),e.querySelectorAll(`[data-screen]`).forEach(e=>e.setAttribute(`aria-pressed`,String(o[+e.dataset.screen]===(o.includes(h)?h:h===`讨论2`?`讨论`:h.startsWith(`就业`)?`就业`:h===`我的2`?`我的`:h.startsWith(`引导`)?``:`首页`)))),e.querySelector(`.ax-hint`).textContent=h.startsWith(`引导`)?`左右滑动浏览引导`:`点击手机内的按钮体验`,h===`首页-下拉`&&f(0,49,100,41,`收起快捷面板`,()=>p(`首页`,!1)),(d[h]||[]).forEach(([e,t,n,r,i])=>f(e,t,n,r,`打开`+i,()=>p(i))),(o.includes(h)||[`首页-下拉`,`我的2`,`就业详情`,`就业-培训列表`,`就业-简历通关`,`讨论2`].includes(h))&&o.forEach((e,t)=>f(t*25,90,25,8,`导航到`+e,()=>p(e))),h.startsWith(`引导`)?f(0,86,100,14,`继续引导`,()=>m(1)):!o.includes(h)&&h!==`我的2`&&h!==`就业详情`&&h!==`首页-下拉`&&f(0,6,12,7,`返回上一页`,()=>p(l.pop()||`首页`,!1));for(let e of d[h]||[])t(r+u[e[4]]).catch(()=>{})}catch{n()&&i.setAttribute(`aria-busy`,`false`)}}function m(e){if(!s.startsWith(`引导`))return;let t=+s.slice(2)+e;t>=1&&p(t>7?`首页`:`引导`+t,!1,e)}let h,g=!1;i.style.touchAction=`none`,i.onpointerdown=e=>{h={x:e.clientX,y:e.clientY},g=!1},i.onpointermove=e=>{h&&s.startsWith(`引导`)&&Math.abs(e.clientX-h.x)>8&&i.setPointerCapture(e.pointerId)},i.onpointerup=e=>{if(!h)return;let t=e.clientX-h.x,n=e.clientY-h.y;h=null,Math.abs(t)>18&&Math.abs(t)>Math.abs(n)&&s.startsWith(`引导`)&&(g=!0,m(t<0?1:-1))},i.addEventListener(`click`,e=>{g&&=(e.preventDefault(),e.stopImmediatePropagation(),!1)},!0),e.querySelector(`[data-screen="4"]`).remove(),e.querySelectorAll(`[data-screen]`).forEach((e,n)=>{e.textContent=o[n],e.onclick=()=>p(o[n]),e.onpointerenter=()=>t(r+u[o[n]]).catch(()=>{}),e.setAttribute(`aria-pressed`,`false`)}),e.querySelector(`.ax-device`).onkeydown=e=>{(e.key===`ArrowLeft`||e.key===`ArrowRight`)&&(e.preventDefault(),m(e.key===`ArrowRight`?1:-1))},e.querySelector(`.ax-start`).onclick=()=>p(`首页`);let _=document.createElement(`video`);_.className=`help-splash`,_.muted=!0,_.playsInline=!0,_.controls=!1,_.disablePictureInPicture=!0,_.disableRemotePlayback=!0,_.src=`数字体验设计/APP设计/助残帮-残障人士特殊群体服务APP/闪屏页.mp4`,i.append(_),_.onended=()=>{n()&&p(`引导1`,!1)},_.onerror=()=>{n()&&p(`引导1`,!1)},_.play().catch(()=>p(`引导1`,!1));for(let e=1;e<=7;e++)t(r+u[`引导`+e]).catch(()=>{})}function t(e,t,n){let r=`数字体验设计/APP设计/颜茶阁-相面修复诊疗服务APP/`,i=e.querySelector(`.ax-screen`),a=e.querySelector(`.ax-hotspots`),o=[`健康`,`商城`,`相面`,`社交`,`我的`],s={闪屏:`闪屏页.png`,健康:`健康/我的健康高保真.png`,商城:`商城/商城首页.png`,相面:`相面/1-4.png`,社交:`社交界面/社交——帮帮.png`,我的:`我的/钱包 (2).png`};for(let e=1;e<=4;e++)s[`引导页`+e]=`引导页/引导页`+e+`.png`;[`健康计划`,`推荐`,`推荐计划查看`,`菜谱`,`查看`,`问诊`,`海日医生`].forEach(e=>s[e]=`健康/`+e+`.png`),s.欢迎=`我的/欢迎.png`,s.钱包=`我的/钱包.png`,s.设置=`我的/设置.png`;let c=[`帮帮`,`问医生`,`圈子`,`养生计划`];c.forEach(e=>s[e]=`社交界面/社交——`+e+`.png`);let l=[`商城首页1`,`在家享`,`配方`,`热量`,`寻`];l.forEach(e=>s[e]=`商城/`+e+`.png`);let u=!1,d={健康:[[3,46,94,13,`健康计划`],[50,60,47,15,`菜谱`],[3,60,45,15,`问诊`]],健康计划:[[69,10,28,6,`推荐`]],推荐:[[3,37,48,35,`推荐计划查看`]],菜谱:[[3,34,95,41,`查看`]],问诊:[[3,19,82,32,`海日医生`]]},f=``,p=0,m=[],h;Object.assign(d,{商城:[[52,53,43,12,`在家享`],[3,77,94,12,`配方`],[4,53,45,12,`寻`]],配方:[[4,65,90,18,`热量`]]}),Object.assign(d,{欢迎:[[28,72,42,10,`健康`]],我的:[[81,14.5,8,4.5,`设置`],[14,24,73,19,`钱包`]]});function g(e,t,n,r,i,o){let s=document.createElement(`button`);s.className=`study-hit`,s.style.cssText=`left:${e}%;top:${t}%;width:${n}%;height:${r}%`,s.setAttribute(`aria-label`,i),s.onclick=o,a.append(s)}function _(){v(m.pop()||`健康`,!1)}async function v(b,x=!0,S=0){clearTimeout(h);let C=++p;x&&f&&f!==b&&m.push(f),f=b,i.classList.toggle(`tea-my-zoom`,s[b].startsWith(`我的/`)),a.replaceChildren(),i.dataset.page=b,i.setAttribute(`aria-busy`,`true`);try{let a=await t(r+s[b]);if(!n()||C!==p)return;let m=a.cloneNode();m.className=`ax-screen-image`,m.alt=`颜茶阁 · `+b,m.draggable=!1;let x=i.querySelector(`.ax-screen-image`);if(S&&x&&!matchMedia(`(prefers-reduced-motion: reduce)`).matches?(x.animate([{transform:`translateX(0)`},{transform:`translateX(${-S*100}%)`}],{duration:220}).finished.then(()=>x.remove()),m.animate([{transform:`translateX(${S*100}%)`},{transform:`translateX(0)`}],{duration:220})):x?.remove(),i.querySelector(`.ax-loading`)?.remove(),i.style.setProperty(`--screen-art`,`url(`+JSON.stringify(m.src)+`)`),i.prepend(m),i.setAttribute(`aria-busy`,`false`),e.querySelectorAll(`[data-screen]`).forEach(e=>e.setAttribute(`aria-pressed`,String(o[+e.dataset.screen]===(o.includes(b)?b:c.includes(b)?`社交`:[`设置`,`钱包`].includes(b)?`我的`:l.includes(b)?`商城`:d[b]||[`推荐计划查看`,`查看`,`海日医生`].includes(b)?`健康`:``)))),e.querySelector(`.ax-hint`).textContent=b.startsWith(`引导页`)?`左右滑动浏览引导`:`点击手机内的按钮体验`,b===`闪屏`){h=setTimeout(()=>{n()&&v(`引导页1`,!1)},2e3);return}(d[b]||[]).forEach(([e,t,n,r,i])=>g(e,t,n,r,`打开`+i,()=>v(i))),o.includes(b)||l.includes(b)||c.includes(b)||[`设置`,`钱包`].includes(b)?o.forEach((e,t)=>{g(...b===`我的`?[[6,90,17,6],[23,90,18,6],[42,90,17,6],[61,90,17,6],[78,86.5,14,8]][t]:[t*20,89,20,8],`导航到`+e,()=>v(e))}):b.startsWith(`引导页`)?g(0,85,100,15,`继续引导`,()=>y(1)):g(0,4,16,9,`返回上一页`,_),(l.includes(b)&&b!==`商城首页1`||[`设置`,`钱包`].includes(b))&&g(0,4,16,9,`返回上一页`,_),b===`商城首页1`&&g(43,68,15,9,`关闭商城提示`,()=>v(`商城`,!1)),b===`商城`&&!u&&(h=setTimeout(()=>{n()&&f===`商城`&&!e.querySelector(`.ax-video-mode`)&&(u=!0,v(`商城首页1`,!1))},2e3+Math.random()*3e3),t(r+s.商城首页1).catch(()=>{})),(b===`社交`||c.includes(b))&&c.forEach((e,t)=>g(t*25,9,25,6,`社交页签`+e,()=>v(e))),b===`查看`&&g(40,68,20,8,`关闭菜品`,_);for(let e of d[b]||[])t(r+s[e[4]]).catch(()=>{})}catch{n()&&i.setAttribute(`aria-busy`,`false`)}}function y(e){if(!f.startsWith(`引导页`))return;let t=+f.slice(-1)+e;t>=1&&v(t>4?`欢迎`:`引导页`+t,!1,e)}let b,x=!1;i.style.touchAction=`none`,i.onpointerdown=e=>{b={x:e.clientX,y:e.clientY},x=!1},i.onpointermove=e=>{b&&f.startsWith(`引导页`)&&Math.abs(e.clientX-b.x)>8&&i.setPointerCapture(e.pointerId)},i.onpointerup=e=>{if(!b)return;let t=e.clientX-b.x,n=e.clientY-b.y;b=null,Math.abs(t)>18&&Math.abs(t)>Math.abs(n)&&(x=!0,y(t<0?1:-1))},i.addEventListener(`click`,e=>{x&&=(e.preventDefault(),e.stopImmediatePropagation(),!1)},!0),e.querySelectorAll(`[data-screen]`).forEach((e,n)=>{e.textContent=o[n],e.onclick=()=>v(o[n]),e.onpointerenter=()=>t(r+s[o[n]]).catch(()=>{})}),e.querySelector(`.ax-device`).onkeydown=e=>{(e.key===`ArrowLeft`||e.key===`ArrowRight`)&&(e.preventDefault(),y(e.key===`ArrowRight`?1:-1))},e.querySelector(`.ax-start`).onclick=()=>{e.querySelector(`.ax-video-mode`)&&e.querySelector(`.ax-rotate`).click(),v(`健康`)},e.addEventListener(`close`,()=>{p++,clearTimeout(h)},{once:!0});for(let e=1;e<=4;e++)t(r+s[`引导页`+e]).catch(()=>{});v(`闪屏`,!1)}function n(e,t,n,r){let i=`数字体验设计/APP设计/学伴-线上学习行为习惯养成APP/`,a=e.querySelector(`.ax-screen`),o=e.querySelector(`.ax-hotspots`),s=``,c=0,l=[],u=null,d=`Ai释放拓展面板`,f={首页:`app/首页/首页.jpg`,课程:`app/首页/课程.jpg`};for(let e=1;e<=4;e++)f[`引导页`+e]=`app/引导页/引导页`+e+`.png`;[`签到`,`消息`,`学习模式`,`好运莲莲`,`发布-话题`,`发布-文`,`发布-图`,`发布成功`,`分享内容`,`图片查看`].forEach(e=>f[e]=`app/首页/`+e+`.jpg`),[`我的`,`我的-学习记录`,`我的-学习记录2`,`设置`,`创建待办`].forEach(e=>f[e]=`app/我的/`+e+`.jpg`),f.学伴=`app/ai/Ai释放拓展面板-1.jpg`;let p=[`学习记录`,`学习记录-1`,`学习记录-2`,`学习记录-3`,`Ai界面-1`,`Ai界面-2`,`Ai释放拓展面板`,`学习空间`,`学习空间-1`,`收起专注聊天框`,`装扮1-2`,`装扮1-1`,`ar`,`ar扫描-1`];p.forEach(e=>f[e]=`app/ai/`+e+`.jpg`),e.addEventListener(`close`,()=>clearTimeout(u),{once:!0}),f.小组=`app/小组/小组-多选择页面.jpg`,e.querySelector(`[data-screen="4"]`)?.remove(),e.querySelector(`[data-screen="1"]`).textContent=`学伴`;let m=[`小组一`,`小组一-1`,`小组一-2`,`小组一-5`,`PK虚拟学伴星球页面`,`小组-多选择页面2`,`选课程数学`,`页面附加二`,`页面附加三`,`页面附加二-1`];m.forEach(e=>f[e]=`app/小组/`+e+`.jpg`);let h=[`首页`,`学伴`,`小组`,`我的`,`课程`],g={签到:`首页`,图片查看:`分享内容`,课程:`学习模式`,学习模式:`首页`,"我的-学习记录":`我的`,"我的-学习记录2":`我的`,设置:`我的`,创建待办:`我的`},_={首页:[[84,4,15,7,`签到`],[1,4,14,7,`消息`],[2,31,23,12,`学习模式`]],学习模式:[[3,41,46,18,`课程`]],消息:[[2,35,94,10,`好运莲莲`]],"发布-话题":[[35,92,25,7,`发布-文`]],"发布-文":[[1,54,14,8,`发布-图`],[80,3,19,7,`发布成功`]],"发布-图":[[80,3,19,7,`发布成功`],[35,92,25,7,`发布-文`]],发布成功:[[50,55,32,8,`分享内容`]],分享内容:[[3,31,94,25,`图片查看`],[3,66,94,24,`图片查看`]]};Object.assign(_,{"我的-学习记录":[[2,9,96,17,`我的-学习记录2`]],我的:[[3,25,94,33,`我的-学习记录`],[84,4,15,8,`设置`],[0,4,16,8,`创建待办`]],课程:[[83,3,17,9,`学习模式`]],学习模式:[[0,0,100,40,`首页`],[3,41,46,18,`课程`]]}),Object.assign(_,{学伴:[[85,6,15,6,`Ai释放拓展面板`]],Ai释放拓展面板:[[85,6,15,6,`Ai释放拓展面板`],[65,10,34,6,`学习空间`]],学习空间:[[70,6,29,6,`学习空间-1`]],"学习空间-1":[[72,14,27,5,`收起专注聊天框`]],收起专注聊天框:[[66,90,34,7,`装扮1-2`]],"装扮1-2":[[0,0,100,27,`学伴`],[24,60,53,9,`装扮1-1`],[0,6,13,7,`装扮1-1`]],"装扮1-1":[[0,0,100,45,`学伴`]],ar:[[85,6,15,6,`Ai释放拓展面板`]]});let v=[`学习记录`,`学习记录-1`,`学习记录-2`,`学习记录-3`];for(let e of v)_[e]=[[21,10,25,6,`学习记录`],[48,10,27,6,`学习记录-1`],[75,10,25,6,`学习记录-3`]];_.学习记录.push([2,58,95,7,`学习记录-2`]);for(let e of[`Ai释放拓展面板`,`Ai界面-1`,`Ai界面-2`])_[e]=[[85,6,15,6,`Ai释放拓展面板`],[65,10,34,6,`学习空间`],[65,16,34,5,`装扮1-1`],[65,21,34,6,`学习记录-3`],[0,69,9,10,`Ai界面-1`]];for(let e of[`学习空间`,`学习空间-1`,`收起专注聊天框`])_[e]=(_[e]||[]).filter(e=>e[4]!==`装扮1-2`),_[e].push([66,90,34,7,`装扮1-1`]);_.收起专注聊天框.push([70,6,29,6,`学习空间-1`]),_[`Ai界面-1`].push([42,70,12,13,`Ai释放拓展面板`]),Object.assign(_,{小组:[[3,28,94,17,`PK虚拟学伴星球页面`],[3,6,42,10,`小组-多选择页面2`],[3,16,42,9,`页面附加二`]],"小组一-5":[[68,14,31,6,`小组一-1`]],"小组-多选择页面2":[[26,12,23,5,`选课程数学`]],页面附加二:[[8,31,84,7,`页面附加三`],[8,39,84,7,`页面附加二-1`]],页面附加三:[[0,0,100,62,`页面附加二`]],"页面附加二-1":[[0,0,100,36,`页面附加二`],[20,89,30,7,`页面附加二`],[65,89,33,7,`页面附加二`]]});for(let e of[`小组一`,`小组一-1`,`小组一-2`])_[e]=[[87,5,13,7,`小组一-5`]];for(let e of m)g[e]=`小组`;g.页面附加三=`页面附加二`,g[`页面附加二-1`]=`页面附加二`;let y=[`首页`,`我的`,`小组`,`学习模式`,`消息`,`学伴`,`Ai释放拓展面板`,`ar`,`Ai界面-1`,`Ai界面-2`,`小组一`,`小组一-1`,`小组一-2`,`小组一-5`,`小组-多选择页面2`,`选课程数学`];function b(e,t,n,r,i,a){let s=document.createElement(`button`);return s.className=`study-hit`,s.style.cssText=`left:${e}%;top:${t}%;width:${n}%;height:${r}%`,s.setAttribute(`aria-label`,i),s.onclick=a,o.append(s),s}function x(){S(l.pop()||`首页`,!1)}async function S(r,C=!0,w=0){clearTimeout(u),v.includes(r)&&!v.includes(s)&&(d=s===`Ai界面-1`?`Ai界面-1`:`Ai释放拓展面板`);let T=++c;C&&s&&s!==r&&l.push(s),s=r,a.dataset.page=r,a.querySelectorAll(`video`).forEach(e=>{e.pause(),e.remove()}),o.replaceChildren(),a.setAttribute(`aria-busy`,`true`);try{let o=await t(i+f[r]);if(!n()||T!==c)return;let l=o.cloneNode();l.className=`ax-screen-image`,l.alt=`学伴 · `+r,l.draggable=!1;let C=a.querySelector(`.ax-screen-image`);if(w&&C&&!matchMedia(`(prefers-reduced-motion: reduce)`).matches?(C.animate([{transform:`translateX(0)`},{transform:`translateX(`+-w*100+`%)`}],{duration:200,easing:`ease-out`}).finished.then(()=>C.remove()).catch(()=>C.remove()),l.animate([{transform:`translateX(`+w*100+`%)`},{transform:`translateX(0)`}],{duration:280,easing:`ease-out`})):C?.remove(),a.querySelector(`.ax-loading`)?.remove(),a.style.setProperty(`--screen-art`,`url(`+JSON.stringify(l.src)+`)`),a.prepend(l),a.setAttribute(`aria-busy`,`false`),e.querySelector(`.ax-step span`).textContent=r,e.querySelectorAll(`[data-screen]`).forEach(e=>e.setAttribute(`aria-pressed`,String(h[+e.dataset.screen]===(h.includes(r)?r:m.includes(r)?`小组`:p.includes(r)?`学伴`:r.startsWith(`我的`)||[`设置`,`创建待办`].includes(r)?`我的`:r.startsWith(`引导页`)?``:`首页`)))),e.querySelector(`.ax-hint`).textContent=r.startsWith(`引导页`)?`向左滑动继续`:`点击手机内的按钮体验`,[`签到`,`图片查看`,`创建待办`].includes(r)&&b(0,0,100,100,`关闭并返回`+g[r],()=>S(g[r])),r===`小组`&&b(47,5,51,21,`我的小组`,()=>S([`小组一`,`小组一-1`,`小组一-2`][Math.floor(Math.random()*3)])),(_[r]||[]).forEach(([e,t,n,r,i])=>b(e,t,n,r,`打开`+i,()=>S(i))),r===`首页`){let e=b(92,84,8,7,`发布话题`,()=>S(`发布-话题`));e.classList.add(`study-publish`),e.innerHTML=`<span>＋</span>`}if(![`首页`,`我的`,`学伴`,`小组`,...p.filter(e=>e!==`ar扫描-1`)].includes(r)&&!r.startsWith(`引导页`)&&b(0,3,16,8,`返回上一页`,()=>g[r]?S(g[r]):x()),[`学习空间`,`学习空间-1`,`收起专注聊天框`,`装扮1-2`,...v].includes(r)&&b(0,6,13,6,`返回上一页`,()=>v.includes(r)?S(d):r===`收起专注聊天框`?S(`学习空间`):x()),y.includes(r))for(let e=0;e<4;e++)b(5+e*23,89,22,8,`导航到`+h[e],()=>S(h[e]));if(r.startsWith(`引导页`)){let e=+r.slice(-1);b(0,87,100,13,`继续引导`,()=>S(e===4?`首页`:`引导页`+(e+1),!0,1))}[`学伴`,`Ai释放拓展面板`,`装扮1-1`,`ar`,`Ai界面-1`,`Ai界面-2`].includes(r)&&b(0,16,14,7,`AR扫描`,()=>S(`ar扫描-1`)),r===`Ai释放拓展面板`&&(t(i+f[`Ai界面-2`]).catch(()=>{}),u=setTimeout(()=>{n()&&e.open&&s===r&&!e.querySelector(`.ax-video-mode`)&&S(`Ai界面-2`,!1)},2e3+Math.random()*3e3)),r===`学伴`&&(t(i+f.ar).catch(()=>{}),u=setTimeout(()=>{n()&&e.open&&s===`学伴`&&!e.querySelector(`.ax-video-mode`)&&S(`ar`,!1)},2e3+Math.random()*3e3));for(let e of _[r]||[])t(i+f[e[4]]).catch(()=>{})}catch{n()&&a.setAttribute(`aria-busy`,`false`)}}let C=null;a.style.touchAction=`none`;let w=!1;a.addEventListener(`pointerdown`,e=>{C={x:e.clientX,y:e.clientY},w=!1}),a.addEventListener(`pointermove`,e=>{C&&s.startsWith(`引导页`)&&Math.abs(e.clientX-C.x)>8&&a.setPointerCapture(e.pointerId)}),a.addEventListener(`pointerup`,e=>{if(!C)return;let t=e.clientX-C.x,n=e.clientY-C.y;if(C=null,Math.abs(t)>18&&Math.abs(t)>Math.abs(n)&&s.startsWith(`引导页`)){w=!0;let e=+s.slice(-1);t<0?S(e===4?`首页`:`引导页`+(e+1),!0,1):e>1&&S(`引导页`+(e-1),!0,-1)}else n<-35&&s===`我的-学习记录`&&(w=!0,S(`我的-学习记录2`,!0,1))}),a.addEventListener(`click`,e=>{w&&=(e.preventDefault(),e.stopImmediatePropagation(),!1)},!0),a.addEventListener(`wheel`,e=>{s===`我的-学习记录`&&e.deltaY>15&&(e.preventDefault(),S(`我的-学习记录2`,!0,1))},{passive:!1}),e.querySelectorAll(`[data-screen]`).forEach(e=>{e.onclick=()=>S(h[+e.dataset.screen]),e.onpointerenter=()=>t(i+f[h[+e.dataset.screen]]).catch(()=>{}),e.setAttribute(`aria-pressed`,`false`)}),e.querySelector(`.ax-step`).style.display=`none`,e.querySelector(`.ax-device`).onkeydown=e=>{if(s.startsWith(`引导页`)&&[`ArrowLeft`,`ArrowRight`].includes(e.key)){e.preventDefault();let t=+s.slice(-1);e.key===`ArrowRight`?S(t===4?`首页`:`引导页`+(t+1),!0,1):t>1&&S(`引导页`+(t-1),!0,-1)}},e.querySelector(`.ax-start`).onclick=()=>{e.querySelector(`.ax-video-mode`)&&e.querySelector(`.ax-rotate`).click(),S(`首页`)};let T=document.createElement(`video`);T.className=`study-splash`,T.muted=!0,T.controls=!1,T.disablePictureInPicture=!0,T.disableRemotePlayback=!0,T.setAttribute(`controlslist`,`nodownload nofullscreen noremoteplayback`),T.setAttribute(`x-webkit-airplay`,`deny`),T.playsInline=!0,T.src=`数字体验设计/APP设计/学伴-线上学习行为习惯养成APP/闪屏.mp4`,a.append(T),T.onended=()=>{n()&&S(`引导页1`,!1)},T.onerror=()=>{n()&&S(`引导页1`,!1)},T.play().catch(()=>S(`引导页1`,!1));for(let e=1;e<=4;e++)t(i+f[`引导页`+e]).catch(()=>{})}var r=[{name:`学伴`,folder:`学伴-线上学习行为习惯养成APP`,headline:[`让学习，`,`成为习惯。`],desc:`用陪伴连接学习与生活，在学习空间、小组交流和个人记录之间，探索习惯养成的体验。`,tags:[`学习`,`陪伴`,`小组`],logo:`数字体验设计/APP设计/体验预览758/0-logo.webp`,accent:`#343d45`,screens:[{label:`首页`,src:`数字体验设计/APP设计/体验预览758/0-0.webp`},{label:`学习空间`,src:`数字体验设计/APP设计/体验预览758/0-1.webp`},{label:`小组`,src:`数字体验设计/APP设计/体验预览758/0-2.webp`},{label:`我的`,src:`数字体验设计/APP设计/体验预览758/0-3.webp`},{label:`课程`,src:`数字体验设计/APP设计/体验预览758/0-4.webp`}],primary:1,bg:`#fffde3`,ink:`#343d45`,muted:`#687680`,soft:`#e5f0fa`,video:`演示视频.mp4`},{name:`颜茶阁`,folder:`颜茶阁-相面修复诊疗服务APP`,headline:[`从日常，`,`关照自己。`],desc:`将相面、健康管理与生活服务串联，探索从个人了解，到日常健康记录的界面体验。`,tags:[`相面`,`健康`,`生活`],logo:`数字体验设计/APP设计/体验预览758/1-logo.webp`,accent:`#34582f`,screens:[{label:`相面`,src:`数字体验设计/APP设计/体验预览758/1-0.webp`},{label:`健康`,src:`数字体验设计/APP设计/体验预览758/1-1.webp`},{label:`商城`,src:`数字体验设计/APP设计/体验预览758/1-2.webp`},{label:`我的`,src:`数字体验设计/APP设计/体验预览758/1-3.webp`},{label:`健康计划`,src:`数字体验设计/APP设计/体验预览758/1-4.webp`}],primary:1,bg:`#f0f7df`,ink:`#29452a`,muted:`#64785a`,soft:`#cee8af`,video:`颜茶阁~1.mp4`},{name:`助残帮`,folder:`助残帮-残障人士特殊群体服务APP`,headline:[`让服务，`,`触手可及。`],desc:`面向残障人士的生活与就业需求，整合便民服务、求职信息和个人中心，让帮助更容易抵达。`,tags:[`无障碍`,`生活服务`,`就业`],logo:`数字体验设计/APP设计/体验预览758/2-logo.webp`,accent:`#cf242b`,screens:[{label:`首页`,src:`数字体验设计/APP设计/体验预览758/2-0.webp`},{label:`就业`,src:`数字体验设计/APP设计/体验预览758/2-1.webp`},{label:`讨论`,src:`数字体验设计/APP设计/体验预览758/2-2.webp`},{label:`我的`,src:`数字体验设计/APP设计/体验预览758/2-3.webp`},{label:`找工作`,src:`数字体验设计/APP设计/体验预览758/2-4.webp`}],primary:1,bg:`#fff0dd`,ink:`#682c28`,muted:`#986451`,soft:`#ffc38a`,video:`闪屏页.mp4`}],i=new Map;function a(e){if(i.has(e))return i.get(e);let t=new Image;t.src=e,t.decoding=`async`;let n=t.decode().then(()=>t).catch(t=>{throw i.delete(e),t});return i.set(e,n),n}function o(e){return a(r[e].screens[0].src).catch(()=>{})}var s=0;function c(){s++,document.querySelectorAll(`.ap-viewer video`).forEach(e=>e.pause())}async function l(i,o,c){let l=++s,u=r[o];i.dataset.theme=String(o),[`accent`,`bg`,`ink`,`muted`,`soft`].forEach(e=>i.style.setProperty(`--app-`+e,u[e])),i.setAttribute(`aria-label`,u.name+` APP作品展示`),i.innerHTML=`<div class="ax-page"><nav class="ax-nav"><button class="ax-back">← 作品集</button><span>APP DESIGN / `+u.name+`</span><button class="ap-close" aria-label="返回APP作品"><span>返回</span> ↗</button></nav><section class="ax-hero"><div class="ax-intro"><div class="ax-brand"><img src="`+u.logo+`" alt="`+u.name+`标识"><span>APP DESIGN · <b>`+u.name+`</b></span></div><h1>`+u.headline[0]+`<br><em>`+u.headline[1]+`</em></h1><h2>`+u.folder.split(`-`)[1]+`</h2><div class="ax-tags">`+u.tags.map(e=>`<span>`+e+`</span>`).join(``)+`</div><p class="ax-description">`+u.desc+`</p><button class="ax-start">开始体验 ↗</button><button class="ax-scroll">向下浏览设计思路 ↓</button></div><div class="ax-device-column"><div class="ax-device" tabindex="0" aria-label="`+u.name+`手机界面，可使用下方按钮切换"><img class="ax-frame" src="数字体验设计/APP设计/框.png" alt=""><div class="ax-screen"><span class="ax-loading" role="status">正在准备界面…</span><div class="ax-hotspots"></div></div><span class="ax-island" aria-hidden="true"></span></div><div class="ax-tabs" role="group" aria-label="切换手机界面">`+u.screens.map((e,t)=>`<button data-screen="`+t+`" aria-pressed="false">`+e.label+`</button>`).join(``)+`</div><p class="ax-hint">点击屏幕底部导航，或选择上方页面体验</p><div class="ax-step"><button class="ax-prev" aria-label="上一个界面">←</button><span></span><button class="ax-next" aria-label="下一个界面">→</button></div></div></section><section class="ax-process"><header><div><p>DESIGN PROCESS</p><h2>从需求，到体验。</h2></div><p>项目思路、视觉规范与完整界面展示<br><span>点击长图放大查看</span></p></header><button class="ax-poster" aria-label="放大查看设计长图"><span role="status">正在加载设计长图…</span></button></section></div>`,i.querySelectorAll(`.ax-back,.ap-close`).forEach(e=>e.onclick=()=>i.close()),i.scrollTop=0;let d=!1,f=i.querySelector(`.ax-device-column`);if(o!==2){let e=document.createElement(`button`);e.className=`ax-rotate`,e.textContent=`↻ 横屏看演示`,e.setAttribute(`aria-pressed`,`false`),f.append(e);let t=document.createElement(`video`);t.className=`ax-inline-video`,t.controls=!0,t.playsInline=!0,t.preload=`metadata`,t.src=`数字体验设计/APP设计/`+u.folder+`/`+u.video,t.setAttribute(`aria-label`,u.name+`演示视频`),i.querySelector(`.ax-device`).append(t),e.onclick=()=>{d=!d,f.classList.toggle(`ax-video-mode`,d),e.textContent=d?`↶ 返回竖屏`:`↻ 横屏看演示`,e.setAttribute(`aria-pressed`,String(d)),f.querySelectorAll(`.ax-tabs,.ax-hint,.ax-step`).forEach(e=>e.inert=d),d?t.play().catch(()=>{}):t.pause()}}let p=0,m=0,h=i.querySelector(`.ax-device`),g=i.querySelector(`.ax-screen`),_=i.querySelector(`.ax-hotspots`);async function v(e){p=(e+u.screens.length)%u.screens.length;let t=++m,n=u.screens[p];i.querySelectorAll(`[data-screen]`).forEach(e=>e.setAttribute(`aria-pressed`,String(+e.dataset.screen===p))),i.querySelector(`.ax-step span`).textContent=String(p+1).padStart(2,`0`)+` / `+String(u.screens.length).padStart(2,`0`)+` · `+n.label,g.setAttribute(`aria-busy`,`true`);try{let e=await a(n.src);if(l!==s||t!==m||!i.open)return;let r=e.cloneNode();r.className=`ax-screen-image`,r.alt=u.name+` · `+n.label,g.querySelector(`.ax-screen-image`)?.remove(),g.querySelector(`.ax-loading`)?.remove(),g.style.setProperty(`--screen-art`,`url(`+JSON.stringify(r.src)+`)`),g.prepend(r),g.setAttribute(`aria-busy`,`false`),_.replaceChildren();for(let e=0;e<4;e++){let t=document.createElement(`button`);t.className=`ax-hotspot`,t.style.left=e*25+`%`,t.setAttribute(`aria-label`,`切换到`+u.screens[e].label),t.title=u.screens[e].label,t.onclick=()=>v(e),_.append(t)}a(u.screens[(p+1)%u.screens.length].src).catch(()=>{})}catch{l===s&&(g.setAttribute(`aria-busy`,`false`),g.querySelector(`.ax-loading`)?.replaceChildren(`界面加载失败，请重新选择页面`))}}i.querySelectorAll(`[data-screen]`).forEach(e=>{e.onclick=()=>v(+e.dataset.screen),e.onpointerenter=()=>a(u.screens[+e.dataset.screen].src).catch(()=>{})}),i.querySelector(`.ax-prev`).onclick=()=>v(p-1),i.querySelector(`.ax-next`).onclick=()=>v(p+1),h.onkeydown=e=>{!d&&(e.key===`ArrowRight`||e.key===`ArrowLeft`)&&(e.preventDefault(),v(p+(e.key===`ArrowRight`?1:-1)))},i.querySelector(`.ax-start`).onclick=()=>{d&&i.querySelector(`.ax-rotate`).click(),v(u.primary),h.scrollIntoView({behavior:matchMedia(`(prefers-reduced-motion: reduce)`).matches?`instant`:`smooth`,block:`center`}),h.focus({preventScroll:!0})},i.querySelector(`.ax-scroll`).onclick=()=>i.querySelector(`.ax-process`).scrollIntoView({behavior:matchMedia(`(prefers-reduced-motion: reduce)`).matches?`instant`:`smooth`}),o===0?n(i,a,()=>l===s,v):o===1?t(i,a,()=>l===s):e(i,a,()=>l===s);let y=i.querySelector(`.ax-poster`);y.onclick=()=>{let e=y.classList.toggle(`ax-zoom`);y.setAttribute(`aria-label`,e?`缩小设计长图`:`放大查看设计长图`)};try{let e=await c(o);if(l!==s||!i.open)return;let t=e.cloneNode();t.alt=u.name+`完整设计展示`,y.replaceChildren(t)}catch{l===s&&(y.textContent=`长图加载失败，请返回后重试。`)}}var u=`\r
precision mediump float;\r
\r
varying vec2 vUv;\r
\r
uniform float iTime;\r
uniform vec3  iResolution;\r
uniform float uScale;\r
\r
uniform vec2  uGridMul;\r
uniform float uDigitSize;\r
uniform float uScanlineIntensity;\r
uniform float uGlitchAmount;\r
uniform float uFlickerAmount;\r
uniform float uNoiseAmp;\r
uniform float uChromaticAberration;\r
uniform float uDither;\r
uniform float uCurvature;\r
uniform vec3  uTint;\r
uniform vec2  uMouse;\r
uniform float uMouseStrength;\r
uniform float uUseMouse;\r
uniform float uPageLoadProgress;\r
uniform float uUsePageLoadAnimation;\r
uniform float uBrightness;\r
uniform float uLightMode;\r
\r
float time;\r
\r
float hash21(vec2 p){\r
  p = fract(p * 234.56);\r
  p += dot(p, p + 34.56);\r
  return fract(p.x * p.y);\r
}\r
\r
float noise(vec2 p)\r
{\r
  return sin(p.x * 10.0) * sin(p.y * (3.0 + sin(time * 0.090909))) + 0.2; \r
}\r
\r
mat2 rotate(float angle)\r
{\r
  float c = cos(angle);\r
  float s = sin(angle);\r
  return mat2(c, -s, s, c);\r
}\r
\r
float fbm(vec2 p)\r
{\r
  p *= 1.1;\r
  float f = 0.0;\r
  float amp = 0.5 * uNoiseAmp;\r
  \r
  mat2 modify0 = rotate(time * 0.02);\r
  f += amp * noise(p);\r
  p = modify0 * p * 2.0;\r
  amp *= 0.454545;\r
  \r
  mat2 modify1 = rotate(time * 0.02);\r
  f += amp * noise(p);\r
  p = modify1 * p * 2.0;\r
  amp *= 0.454545;\r
  \r
  mat2 modify2 = rotate(time * 0.08);\r
  f += amp * noise(p);\r
  \r
  return f;\r
}\r
\r
float pattern(vec2 p, out vec2 q, out vec2 r) {\r
  vec2 offset1 = vec2(1.0);\r
  vec2 offset0 = vec2(0.0);\r
  mat2 rot01 = rotate(0.1 * time);\r
  mat2 rot1 = rotate(0.1);\r
  \r
  q = vec2(fbm(p + offset1), fbm(rot01 * p + offset1));\r
  r = vec2(fbm(rot1 * q + offset0), fbm(q + offset0));\r
  return fbm(p + r);\r
}\r
\r
float digit(vec2 p){\r
    vec2 grid = uGridMul * 15.0;\r
    vec2 s = floor(p * grid) / grid;\r
    p = p * grid;\r
    vec2 q, r;\r
    float intensity = pattern(s * 0.1, q, r) * 1.3 - 0.03;\r
    \r
    if(uUseMouse > 0.5){\r
        vec2 mouseWorld = uMouse * uScale;\r
        float distToMouse = distance(s, mouseWorld);\r
        float mouseInfluence = exp(-distToMouse * 8.0) * uMouseStrength * 10.0;\r
        intensity += mouseInfluence;\r
        \r
        float ripple = sin(distToMouse * 20.0 - iTime * 5.0) * 0.1 * mouseInfluence;\r
        intensity += ripple;\r
    }\r
    \r
    if(uUsePageLoadAnimation > 0.5){\r
        float cellRandom = fract(sin(dot(s, vec2(12.9898, 78.233))) * 43758.5453);\r
        float cellDelay = cellRandom * 0.8;\r
        float cellProgress = clamp((uPageLoadProgress - cellDelay) / 0.2, 0.0, 1.0);\r
        \r
        float fadeAlpha = smoothstep(0.0, 1.0, cellProgress);\r
        intensity *= fadeAlpha;\r
    }\r
    \r
    p = fract(p);\r
    p *= uDigitSize;\r
    \r
    float px5 = p.x * 5.0;\r
    float py5 = (1.0 - p.y) * 5.0;\r
    float x = fract(px5);\r
    float y = fract(py5);\r
    \r
    float i = floor(py5) - 2.0;\r
    float j = floor(px5) - 2.0;\r
    float n = i * i + j * j;\r
    float f = n * 0.0625;\r
    \r
    float isOn = step(0.1, intensity - f);\r
    float brightness = isOn * (0.2 + y * 0.8) * (0.75 + x * 0.25);\r
    \r
    return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0) * brightness;\r
}\r
\r
float onOff(float a, float b, float c)\r
{\r
  return step(c, sin(iTime + a * cos(iTime * b))) * uFlickerAmount;\r
}\r
\r
float displace(vec2 look)\r
{\r
    float y = look.y - mod(iTime * 0.25, 1.0);\r
    float window = 1.0 / (1.0 + 50.0 * y * y);\r
    return sin(look.y * 20.0 + iTime) * 0.0125 * onOff(4.0, 2.0, 0.8) * (1.0 + cos(iTime * 60.0)) * window;\r
}\r
\r
vec3 getColor(vec2 p){\r
    \r
    float bar = step(mod(p.y + time * 20.0, 1.0), 0.2) * 0.4 + 1.0;\r
    bar *= uScanlineIntensity;\r
    \r
    float displacement = displace(p);\r
    p.x += displacement;\r
\r
    if (uGlitchAmount != 1.0) {\r
      float extra = displacement * (uGlitchAmount - 1.0);\r
      p.x += extra;\r
    }\r
\r
    float middle = digit(p);\r
    \r
    const float off = 0.002;\r
    float sum = digit(p + vec2(-off, -off)) + digit(p + vec2(0.0, -off)) + digit(p + vec2(off, -off)) +\r
                digit(p + vec2(-off, 0.0)) + digit(p + vec2(0.0, 0.0)) + digit(p + vec2(off, 0.0)) +\r
                digit(p + vec2(-off, off)) + digit(p + vec2(0.0, off)) + digit(p + vec2(off, off));\r
    \r
    vec3 baseColor = vec3(0.9) * middle + sum * 0.1 * vec3(1.0) * bar;\r
    return baseColor;\r
}\r
\r
vec2 barrel(vec2 uv){\r
  vec2 c = uv * 2.0 - 1.0;\r
  float r2 = dot(c, c);\r
  c *= 1.0 + uCurvature * r2;\r
  return c * 0.5 + 0.5;\r
}\r
\r
void main() {\r
    time = iTime * 0.333333;\r
    vec2 uv = vUv;\r
\r
    if(uCurvature != 0.0){\r
      uv = barrel(uv);\r
    }\r
    \r
    vec2 p = uv * uScale;\r
    vec3 col = getColor(p);\r
\r
    if(uChromaticAberration != 0.0){\r
      vec2 ca = vec2(uChromaticAberration) / iResolution.xy;\r
      col.r = getColor(p + ca).r;\r
      col.b = getColor(p - ca).b;\r
    }\r
\r
    col *= uTint;\r
    col *= uBrightness;\r
\r
    if(uDither > 0.0){\r
      float rnd = hash21(gl_FragCoord.xy);\r
      col += (rnd - 0.5) * (uDither * 0.003922);\r
    }\r
\r
    if (uLightMode > 0.5) {\r
      float energy = max(max(col.r, col.g), col.b);\r
      float coverage = clamp(smoothstep(0.0, 0.72, energy) * 0.9, 0.0, 0.9);\r
      vec3 ink = clamp(col * 0.42, 0.0, 0.76);\r
      col = mix(vec3(1.0), ink, coverage);\r
    }\r
\r
    gl_FragColor = vec4(col, 1.0);\r
}\r
`;function d(e,t){let n=t.getContext(`webgl`,{alpha:!1,antialias:!1});if(!n)return()=>{};let r=n.createShader(n.VERTEX_SHADER);n.shaderSource(r,`attribute vec2 position;varying vec2 vUv;void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`),n.compileShader(r);let i=n.createShader(n.FRAGMENT_SHADER);if(n.shaderSource(i,u),n.compileShader(i),!n.getShaderParameter(i,n.COMPILE_STATUS))return console.warn(n.getShaderInfoLog(i)),()=>{};let a=n.createProgram();n.attachShader(a,r),n.attachShader(a,i),n.linkProgram(a),n.useProgram(a);let o=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),n.STATIC_DRAW);let s=n.getAttribLocation(a,`position`);n.enableVertexAttribArray(s),n.vertexAttribPointer(s,2,n.FLOAT,!1,0,0);let c=e=>n.getUniformLocation(a,e);for(let[e,t]of Object.entries({uScale:1.5,uDigitSize:1.2,uScanlineIntensity:.35,uGlitchAmount:.4,uFlickerAmount:.3,uNoiseAmp:1,uChromaticAberration:0,uDither:0,uCurvature:.19,uMouseStrength:.4,uUseMouse:1,uPageLoadProgress:1,uUsePageLoadAnimation:1,uBrightness:.65,uLightMode:0}))n.uniform1f(c(e),t);n.uniform2f(c(`uGridMul`),2,1),n.uniform3f(c(`uTint`),1,.827,.357);let l=0,d=!1,f=0,p=.5,m=.5,h=0,g=!1,_=matchMedia(`(prefers-reduced-motion: reduce)`),v=document.getElementById(`creative`);function y(){return d&&v.classList.contains(`active`)&&!document.hidden&&!document.body.classList.contains(`is-project-open`)}function b(r,i=!1){if(l=0,!(!i&&!y())){if(i||r-f>=40){f=r;let a=Math.max(1,Math.round(e.clientWidth*.75)),o=Math.max(1,Math.round(e.clientHeight*.75));(t.width!==a||t.height!==o)&&(t.width=a,t.height=o,n.viewport(0,0,a,o)),n.uniform3f(c(`iResolution`),a,o,a/o);let s=i||!g||_.matches?1:Math.min(1,.18+(r-h)/1600);n.uniform1f(c(`uPageLoadProgress`),s),t.dataset.intro=String(s<1),t.dataset.curvature=`0.19`,n.uniform1f(c(`iTime`),_.matches?10:r*3e-4+10),n.uniform2f(c(`uMouse`),p,m),n.drawArrays(n.TRIANGLES,0,3)}!i&&!_.matches&&(l=requestAnimationFrame(b))}}function x(){cancelAnimationFrame(l),l=0,t.dataset.running=String(y()&&!_.matches),y()&&(l=requestAnimationFrame(b))}new IntersectionObserver(e=>{let t=e[0];d=t.isIntersecting;let n=t.intersectionRatio>=.6;n&&!g&&(h=performance.now()),g=n,x()},{threshold:[0,.05,.6,1]}).observe(e),new ResizeObserver(()=>{e.clientWidth&&e.clientHeight&&(cancelAnimationFrame(l),b(performance.now(),!0),x())}).observe(e);let S=new MutationObserver(x);return S.observe(v,{attributes:!0,attributeFilter:[`class`]}),S.observe(document.body,{attributes:!0,attributeFilter:[`class`]}),document.addEventListener(`visibilitychange`,x),_.addEventListener(`change`,x),e.addEventListener(`pointermove`,t=>{let n=e.getBoundingClientRect();p=(t.clientX-n.left)/n.width,m=1-(t.clientY-n.top)/n.height}),x}var f=[`学伴-线上学习行为习惯养成APP`,`颜茶阁-相面修复诊疗服务APP`,`助残帮-残障人士特殊群体服务APP`],p=[`学伴`,`颜茶阁`,`助残帮`],m=[`线上学习行为习惯养成APP`,`相面修复诊疗服务APP`,`残障人士特殊群体服务APP`],h=[`学习行为 / 习惯养成`,`相面修复 / 诊疗服务`,`无障碍 / 社会服务`],g=[`学伴海报.png`,`展示长图.png`,`海报.png`],_=new Map;function v(e){if(_.has(e))return _.get(e);let t=new Image;t.decoding=`async`,t.alt=f[e]+`作品展示`,t.src=`数字体验设计/APP设计/`+f[e]+`/`+g[e];let n=t.decode().then(()=>t).catch(t=>{throw _.delete(e),t});return _.set(e,n),n}async function y(){for(let e=0;e<f.length;e++)try{await v(e),await o(e)}catch{}}var b=[];function x(){let e=matchMedia(`(prefers-reduced-motion: reduce)`).matches;C.querySelector(`.ap-large-folder`).getBoundingClientRect();let t=[...C.querySelectorAll(`.ap-large-folder .ap-paper`)].map(e=>e.getBoundingClientRect());C.classList.add(`ap-expanded`),b.forEach(e=>e.cancel()),b=[...C.querySelectorAll(`.ap-project`)].map((n,r)=>{let i=n.getBoundingClientRect(),a=t[r],o=a.left+a.width/2-i.left-i.width/2,s=a.top+a.height/2-i.top-i.height/2;return n.animate([{transform:`translate(`+o+`px,`+s+`px) scale(`+a.width/i.width+`,`+a.height/i.height+`)`,opacity:1},{transform:`translate(`+o*.85+`px,`+(s-90)+`px) scale(.45)`,opacity:1,offset:.35},{transform:`translate(0,0) scale(1)`,opacity:1}],{duration:e?0:780,delay:e?0:r*110,easing:`cubic-bezier(.22,.75,.25,1)`,fill:`backwards`})})}function S(){return`<span class="ap-folder"><span class="ap-folder-back"></span><span class="ap-paper p1"></span><span class="ap-paper p2"></span><span class="ap-paper p3"></span><span class="ap-folder-front"><b>APP</b><small>DESIGN COLLECTION / 03</small></span></span>`}var C=document.createElement(`dialog`);C.className=`ap-dialog`,C.setAttribute(`aria-label`,`APP设计作品`),C.innerHTML=`<button class="ap-close" aria-label="关闭APP作品">×</button><div class="ap-stage"><header><p>APP DESIGN / SELECTED WORKS</p><h2>连接需求 × 塑造体验</h2></header><div class="ap-large-folder">`+S()+`</div><div class="ap-projects">`+p.map((e,t)=>`<button class="ap-project" data-project="`+t+`" style="--i:`+t+`"><span class="ap-project-no">0`+(t+1)+`</span><span class="ap-project-label">`+h[t]+`</span><strong>`+e+`</strong><span class="ap-project-desc">`+m[t]+`</span><span class="ap-project-foot">APP DESIGN <b>查看作品 ↗</b></span></button>`).join(``)+`</div></div>`,document.body.append(C);var w=document.createElement(`dialog`);w.className=`ap-viewer`,w.innerHTML=`<button class="ap-close" aria-label="返回APP作品">×</button><h2></h2><img alt="">`,document.body.append(w);var T,E,D,O,k;function A(e){let t=document.querySelector(`.target-cursor-wrapper`);t&&(O||=t.parentElement,e.append(t))}function j(e){if(C.open)return;T.classList.remove(`ap-preview`),E=document.activeElement;let t=T.querySelector(`.ap-folder`).getBoundingClientRect();D=document.body.style.overflow,document.body.style.overflow=`hidden`,document.body.classList.add(`ap-open`,`is-project-open`),C.showModal(),C.classList.remove(`ap-expanded`),C.querySelector(`.ap-projects`).inert=!0,A(C);let n=C.querySelector(`.ap-large-folder`),r=n.getBoundingClientRect(),i=matchMedia(`(prefers-reduced-motion: reduce)`).matches;k=n.animate([{transform:`translate(`+(t.left+t.width/2-r.left-r.width/2)+`px,`+(t.top+t.height/2-r.top-r.height/2)+`px) scale(`+t.width/r.width+`)`},{transform:`translate(0,0) scale(1)`}],{duration:i?0:520,easing:`cubic-bezier(.2,.8,.2,1)`}),k.finished.then(async()=>{C.open&&(i||await new Promise(e=>setTimeout(e,280)),C.open&&(x(),C.querySelector(`.ap-projects`).inert=!1,Number.isInteger(e)&&C.querySelector(`[data-project="`+e+`"]`).focus({preventScroll:!0})))}).catch(()=>{}),C.querySelector(`.ap-close`).focus({preventScroll:!0})}function M(){C.close()}C.querySelector(`.ap-close`).onclick=M,C.addEventListener(`close`,()=>{if(k?.cancel(),b.forEach(e=>e.cancel()),C.classList.remove(`ap-expanded`),document.body.style.overflow=D,document.body.classList.remove(`ap-open`,`is-project-open`),O){let e=document.querySelector(`.target-cursor-wrapper`);e&&O.append(e),O=null}E?.focus({preventScroll:!0})});for(let e of[C,w]){let t=!1;e.addEventListener(`pointerdown`,n=>{t=n.target===e}),e.addEventListener(`click`,n=>{t&&n.target===e&&e.close(),t=!1})}C.querySelectorAll(`[data-project]`).forEach(e=>e.onclick=()=>{w.open||w.showModal(),l(w,+e.dataset.project,v),A(w),w.querySelector(`.ap-close`).focus({preventScroll:!0})}),w.addEventListener(`close`,()=>{c(),w.querySelector(`.ax-page`)?.remove(),A(C)});function N(){let e=document.querySelectorAll(`#creative .card-base`)[1];if(!e||e.classList.contains(`ap-card`))return;T=e,e.classList.add(`ap-card`),e.tabIndex=0,e.setAttribute(`role`,`button`),e.setAttribute(`aria-label`,`探索应用设计`),e.setAttribute(`aria-haspopup`,`dialog`);let t=document.createElement(`div`);t.className=`ap-content`,t.innerHTML=`<canvas class="ap-terminal" aria-hidden="true"></canvas><div class="ap-shade"></div><div class="ap-layout"><div class="ap-folder-zone" tabindex="0" aria-label="预览三个APP项目">`+S()+`<div class="ap-pills">`+f.map((e,t)=>`<button type="button" class="ap-pill" style="--i:`+t+`" data-pill="`+t+`">`+e+`</button>`).join(``)+`</div></div><div class="ap-copy"><p>APP设计</p><h3>连接需求<span>× 塑造体验</span></h3><div>信息架构 / 交互流程 / 视觉系统</div><span class="ap-enter">探索应用设计 <b>↗</b></span></div></div><span class="ap-index">02 / DIGITAL EXPERIENCE</span>`,e.append(t),d(e,t.querySelector(`canvas`)),e.addEventListener(`click`,e=>{e.stopImmediatePropagation(),j(e.target.closest(`[data-pill]`)?+e.target.closest(`[data-pill]`).dataset.pill:void 0)},!0),e.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&!e.target.closest(`button`)&&(e.preventDefault(),e.stopImmediatePropagation(),j())},!0);let n=t.querySelector(`.ap-folder-zone`),r=0;function i(){clearTimeout(r),C.open||e.classList.add(`ap-preview`)}function a(){clearTimeout(r),r=setTimeout(()=>e.classList.remove(`ap-preview`),120)}n.addEventListener(`pointerenter`,i),n.addEventListener(`pointermove`,i),n.addEventListener(`pointerleave`,a),document.addEventListener(`pointerover`,e=>{n.contains(e.target)?i():C.open||a()},{passive:!0}),window.addEventListener(`blur`,()=>{clearTimeout(r),e.classList.remove(`ap-preview`)});let s=new IntersectionObserver(e=>{if(e.some(e=>e.isIntersecting)){s.disconnect();let e=()=>y();window.requestIdleCallback?requestIdleCallback(e,{timeout:1200}):setTimeout(e,200)}},{rootMargin:`250px`});s.observe(e),C.querySelectorAll(`[data-project]`).forEach(e=>{let t=()=>{v(+e.dataset.project).catch(()=>{}),o(+e.dataset.project)};e.addEventListener(`pointerenter`,t),e.addEventListener(`focus`,t)})}new MutationObserver(N).observe(document.getElementById(`creative`),{childList:!0,subtree:!0}),N();var P=new IntersectionObserver(e=>{for(let{target:t,isIntersecting:n}of e)!n||!t.getClientRects().length||(P.unobserve(t),t.loading=`eager`,t.decoding=`async`,t.decode?.().catch(()=>{}))},{rootMargin:`400px 0px`}),F=new WeakSet;function I(){document.querySelectorAll(`img[loading="lazy"]`).forEach(e=>{F.has(e)||(F.add(e),P.observe(e))})}var L=!1;new MutationObserver(()=>{L||(L=!0,requestAnimationFrame(()=>{L=!1,I()}))}).observe(document.body,{childList:!0,subtree:!0}),I(),document.addEventListener(`click`,e=>{e.target.closest(`[data-nav-page="creative"][data-nav-card="1"]`)&&(e.preventDefault(),e.stopImmediatePropagation(),window.showPage(`creative`),requestAnimationFrame(()=>{N(),requestAnimationFrame(()=>j())}))},!0)})();