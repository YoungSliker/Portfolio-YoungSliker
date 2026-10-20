import {useEffect,useRef,useState,type RefObject} from 'react';
export function useJourney(root:RefObject<HTMLElement|null>) {
  const [active,setActive]=useState(0);
  const last=useRef(-1);
  useEffect(()=>{
    const section=root.current;if(!section)return;
    const nodes=Array.from(section.querySelectorAll<HTMLElement>('[data-timeline-entry]'));
    let frame=0;
    const measure=()=>{
      frame=0;
      const line=Math.max(150,innerHeight*.38);
      const tops=nodes.map(node=>node.getBoundingClientRect().top);
      let index=0;
      for(let i=0;i<tops.length;i++)if(tops[i]<=line)index=i;
      if(last.current!==index){last.current=index;setActive(index);}
      const distance=tops[0]-tops[tops.length-1];
      const progress=distance?Math.min(1,Math.max(0,(line-tops[0])/distance)):0;
      section.style.setProperty('--journey-progress',String(progress));
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(measure);};
    const observer=new ResizeObserver(schedule);observer.observe(section);
    window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
    measure();
    return()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
  },[root]);
  return active;
}
