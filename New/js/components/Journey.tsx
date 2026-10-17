import { SectionHeading } from './SectionHeading';

export function Journey() {
  return <section id="journey" className="section journey" aria-label="成长经历">
    <SectionHeading number="03" label="THE JOURNEY">EVERY STEP,<br />A NEW PERSPECTIVE.</SectionHeading>
    <div className="journey-body"><p className="large-copy">从学习到实践，<br />把探索连接成一条线。</p><div className="phase-note"><span className="status-label">经历整理中</span><p>教育、实习、项目与获奖经历将在这里汇合。准确日期与个人职责核对后，逐项加入成长时间轴。</p><div className="journey-types"><span>教育</span><span>实践</span><span>项目</span><span>获奖</span></div></div></div>
  </section>;
}
