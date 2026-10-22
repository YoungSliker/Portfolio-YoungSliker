import {useEffect,useRef} from 'react';

export function InteractiveCursor(){
  const ref=useRef<HTMLDivElement>(null);
  useEffect(()=>{
    const el=ref.current;
    if(!el || !window.matchMedia('(pointer:fine)').matches) return;
    const move=(event:PointerEvent)=>{
      el.setAttribute('data-visible','');
      const target=event.target as HTMLElement|null;
      const interactive=target?.closest('a[href],button:not(:disabled),[role="button"],[data-cursor-expand]');
      document.documentElement.classList.add('portfolio-cursor-enabled');
      el.style.setProperty('--cursor-x',`${event.clientX}px`);
      el.style.setProperty('--cursor-y',`${event.clientY}px`);
      el.toggleAttribute('data-active',!!interactive);
      if(interactive){
        const rect=(interactive as HTMLElement).getBoundingClientRect();
        el.style.setProperty('--frame-width',`${rect.width}px`);
        el.style.setProperty('--frame-height',`${rect.height}px`);
        el.style.setProperty('--frame-x',`${rect.left-event.clientX}px`);
        el.style.setProperty('--frame-y',`${rect.top-event.clientY}px`);
      }else {el.style.setProperty('--frame-width','36px');el.style.setProperty('--frame-height','36px');el.style.setProperty('--frame-x','-18px');el.style.setProperty('--frame-y','-18px');}
    };
    const leave=()=>{el.removeAttribute('data-visible');document.documentElement.classList.remove('portfolio-cursor-enabled');};
    const enter=()=>el.setAttribute('data-visible','');
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('pointerenter',enter); window.addEventListener('pointerleave',leave);
    return()=>{leave();window.removeEventListener('pointermove',move);window.removeEventListener('pointerenter',enter);window.removeEventListener('pointerleave',leave);};
  },[]);
  return <div ref={ref} className="interactive-cursor" aria-hidden="true"><i className="interactive-cursor__dot"/><i className="interactive-cursor__corners"/></div>;
}
