import '../../css/drafting-details.css';

/** Quiet construction marks: decorative, never a pointer or accessibility target. */
export function DraftingDetails({ variant }: { variant: 'hero' | 'about' | 'journey' | 'works' | 'contact' }) {
  return <div className={`drafting-details drafting-details--${variant}`} aria-hidden="true">
    <svg viewBox="0 0 240 120" fill="none" focusable="false">
      <g className="drafting-guides" stroke="currentColor" strokeWidth=".65">
        <path d="M12 104H228M22 99v10m196-10v10M22 15v75M17 24h10m-10 57h10"/>
        {Array.from({length: 20}, (_, i) => <path key={i} d={`M${22+i*10} 104v${i%5===0?-7:-3}`}/>)}
        <path d="M48 60h172M134 10v83" strokeDasharray="2 5"/>
        {variant === 'works' || variant === 'hero' ? <>
          <rect x="90" y="25" width="87" height="62"/>
          <path d="M90 87l87-62M90 25l87 62M184 25h13m-13 62h13m-6-62v62"/>
          <circle cx="134" cy="56" r="31"/>
        </> : <>
          <circle cx="116" cy="58" r="34"/>
          <circle cx="151" cy="58" r="34"/>
          <path d="M91 83a60 60 0 0 1 90-60M116 58l35-29 34 29"/>
        </>}
      </g>
      <path className="drafting-accent" d="M130 58h8m-4-4v8M18 20h8m-4-4v8" stroke="currentColor" strokeWidth="1"/>
      <g fill="currentColor" className="drafting-labels"><text x="42" y="20">{variant === 'journey' ? 'TRACE / 03' : variant === 'works' ? 'FORM / 04' : variant === 'contact' ? 'CONNECT / 05' : 'IDEA / STUDY'}</text><text x="193" y="96">1 : 1</text></g>
    </svg>
    <span className="drafting-margin"><i/> {variant === 'journey' ? 'PROCESS' : 'WORK IN PROGRESS'} <i/></span>
  </div>;
}
