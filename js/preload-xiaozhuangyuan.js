/* 小状元模型提前加载：站点空闲后预取，避免进入作品卡片时长时间等待 */
(function(){
  var BASE='数字体验设计/新媒体艺术设计/小状元模型722/';
  function start(){
    if(location.protocol==='file:'){
      if(window.SCHOLAR_MODEL_DATA||window.__SCHOLAR_PRELOAD)return;
      window.__SCHOLAR_PRELOAD=new Promise(function(res,rej){
        var s=document.createElement('script');
        s.src=BASE+'models-local.js';
        s.onload=function(){res()};
        s.onerror=function(){rej(Error('小状元模型资源加载失败'))};
        document.head.appendChild(s);
      }).catch(function(){});
    }else{
      ['Body','Head','HatWing'].forEach(function(n){
        var l=document.createElement('link');
        l.rel='prefetch';l.as='fetch';l.crossOrigin='anonymous';
        l.href=BASE+n+'.glb';
        document.head.appendChild(l);
      });
    }
  }
  function idle(){
    if(window.requestIdleCallback){requestIdleCallback(start,{timeout:3000});}
    else{setTimeout(start,1200);}
  }
  if(document.readyState==='complete'){idle();}
  else{window.addEventListener('load',idle);}
})();