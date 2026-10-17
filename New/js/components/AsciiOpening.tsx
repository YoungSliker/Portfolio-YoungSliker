export function AsciiOpening({ onEnter }: { onEnter: () => void }) {
  return <div className="ascii-opening">
    <canvas className="ascii-canvas" aria-hidden="true" />
    <div className="ascii-top"><span>YOUNGSLIKER®</span><span>CREATIVE ARCHIVE / 2026</span></div>
    <div className="ascii-copy">
      <div className="ascii-rule"><span>∞</span></div>
      <p className="ascii-label">EVERY IDEA BEGINS WITH A PUSH.</p>
      <h2>ENDLESS<br className="ascii-mobile-break" /> PURSUIT</h2>
      <p className="ascii-description">每一次探索，每一个像素，<br />都让想象中的世界，向前一步。</p>
      <button className="ascii-enter" onClick={onEnter}>进入创作档案 <span>↗</span></button>
      <div className="ascii-signature">AI × DESIGN × INTERACTION <span>∞</span></div>
    </div>
    <button className="ascii-scroll" onClick={onEnter} aria-label="向下滚动开始，进入作品集">
      <span className="ascii-mouse" aria-hidden="true"><i /></span>
      <span>向下滚动开始</span><small>SCROLL TO BEGIN</small>
    </button>
    <span className="ascii-corner ascii-corner--a" /><span className="ascii-corner ascii-corner--b" />
  </div>;
}
