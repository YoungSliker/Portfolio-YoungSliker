import {useEffect,useRef} from 'react';

export function InteractiveCursor(){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current;
    if(!el || !window.matchMedia('(pointer:fine)').matches) return;
    const move=(event:PointerEvent)=>{
      const target=event.target as HTMLElement|null;
      const interactive=target?.closest('a,button,[data-cursor-expand],.flowing-menu__link');
      el.style.setProperty('--cursor-x',`${event.clientX}px`);
      el.style.setProperty('--cursor-y',`${event.clientY}px`);
      el.toggleAttribute('data-active',!!interactive);
      if(interactive){
        const rect=(interactive as HTMLElement).getBoundingClientRect();
        const size=Math.max(34,Math.min(76,Math.max(rect.width,rect.height)*.22));
        el.style.setProperty('--cursor-size',`${size}px`);
      }else el.style.setProperty('--cursor-size','24px');
    };
    const leave=()=>el.removeAttribute('data-visible');
    const enter=()=>el.setAttribute('data-visible','');
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('pointerenter',enter); window.addEventListener('pointerleave',leave);
    return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerenter',enter);window.removeEventListener('pointerleave',leave);};
  },[]);
  return <div ref={ref} className="interactive-cursor" aria-hidden="true"><i className="interactive-cursor__dot"/><i className="interactive-cursor__corners"/></div>;
}
