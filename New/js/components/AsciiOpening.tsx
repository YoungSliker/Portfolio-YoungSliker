import CursorGrid from './CursorGrid';
import type { CSSProperties } from 'react';

export function AsciiOpening({ onEnter }: { onEnter: () => void }) {
  return <div className="ascii-opening">
    <div className="ascii-grid" aria-hidden="true">
      <CursorGrid cellSize={60} color="#b35b3c" gridColor="#888888" highlight="area"
        gridStyle="crosses" radius={140} holdTime={400} fadeDuration={800}
        fillOpacity={.035} gridOpacity={.14} maxOpacity={.35} spotlight={.35} clickPulse intro={false} />
    </div>
    <canvas className="ascii-canvas" aria-hidden="true" />
    <div className="ascii-meteor" aria-hidden="true"><i /></div>
    <div className="ascii-atoms" aria-hidden="true">
      {[0,1,2].map(atom=><div className={`ascii-atom ascii-atom--${atom}`} key={atom}>
        <div className="atom-nucleus">{Array.from({length:13},(_,i)=><i key={i} style={{'--i':i} as CSSProperties} />)}</div>
        {[0,1,2].map(orbit=><div className="atom-orbit" key={orbit} style={{'--orbit':orbit} as CSSProperties}>
          {[-1,0,1].map(lane=><span className={`atom-track${lane?' atom-track--secondary':''}`} key={lane} style={{'--offset':`${lane*7}px`} as CSSProperties}>
            {Array.from({length:64},(_,i)=><i key={i} style={{'--angle':`${i*360/64}deg`} as CSSProperties} />)}
          </span>)}
          <span className="atom-electron"><b /></span>
        </div>)}
      </div>)}
    </div>
    <button className="ascii-skip" onClick={onEnter}>跳过开场</button>
    <span className="ascii-corner ascii-corner--a" /><span className="ascii-corner ascii-corner--b" />
  </div>;
}
