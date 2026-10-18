export function LoadingIntro({onEnter}:{onEnter:()=>void}) {
 return <div className="loading-intro" role="status" aria-label="正在进入作品集">
  <button className="loading-skip" onClick={onEnter}>跳过开场</button>
 </div>;
}
