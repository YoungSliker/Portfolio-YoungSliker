(()=>{
 const home=document.getElementById('home');
 function resize(){
  const width=document.documentElement.clientWidth,height=window.visualViewport?.height||window.innerHeight;
  const scale=Math.min(width*(width<700?.92:.8333)/1561.6,height*.5555/538.27);
  home.style.setProperty('--home-poster-scale',String(scale));
 }
 resize();window.addEventListener('resize',resize,{passive:true});window.visualViewport?.addEventListener('resize',resize,{passive:true});
})();
