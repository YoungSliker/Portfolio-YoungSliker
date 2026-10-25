import { useEffect, useRef, useState } from 'react';
import TearTicket from './TearTicket';
import '../../css/artwork-ticket.css';

const labels: Record<string, { short: string; title: string; description: string }> = {
  '202507': { short: '绥远', title: '绥远方志 Suiyuan', description: '史志体验场景设计' },
  '202308': { short: '矿山', title: '矿山*生态 Kuangshan', description: '深度建模实机演示' },
  '202406': { short: '灵溯', title: '微元灵溯 Lingsu', description: '隐性饥饿艺术交互' },
};
export function ArtworkTicket({ title, date, image, qrValue, width, height }: {
  title: string; description: string; date: string; image?: string; qrValue: string; width: number; height: number;
}) {
  const vertical = height > width;
  const host = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [qr, setQr] = useState('');
  const label = labels[date] ?? { short: '设计', title, description: '创作选集 · 随机呈现' };
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / (vertical ? 280 : 464)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [vertical]);
  useEffect(() => {
    let active = true;
    import('qrcode').then(({default:QRCode})=>QRCode.toDataURL(qrValue, { margin: 4, width: 256, color: { dark: '#d94a1c', light: '#ffffff' } }))
      .then(value => { if (active) setQr(value); }).catch(() => { if (active) setQr(''); });
    return () => { active = false; };
  }, [qrValue]);
  return <div ref={host} className="artwork-ticket" data-parallax={date === 'RANDOM' ? 'true' : 'false'} data-layout={vertical ? 'portrait' : 'landscape'}
    style={{ aspectRatio: vertical ? '280 / 464' : '464 / 280' }}>
    <div className="artwork-ticket__sheet" style={{
      transform: vertical ? `scale(${scale})` : `translateY(${280 * scale}px) rotate(-90deg) scale(${scale})`,
    }}>
      <TearTicket image={image} imageAlt={title + '作品图像'}
        width={280} height={464} orientation="vertical" stubSize={74}
        scrim={false} imageRadius={0} radius={0} holes={16} holeSize={2} notch={3} roughness={0}
        tearAngle={30} stretch={20} resistance={.45} rotate={0}
        tilt={date === 'RANDOM'} tiltMax={5} tiltReach={180} parallax={date === 'RANDOM' ? 9 : 0} perspective={1000}
        background="#fffdf7" stubBackground="#fffdf7" color="#d94a1c"
        border={false} recenter={false} ariaLabel={'撕开' + title + '作品票根'}
        stub={<div className="artwork-ticket__stub">
          <span className="artwork-ticket__name">{label.short}</span>
          <div className="artwork-ticket__caption">
            <h2>{label.title}</h2>
            <p className="artwork-ticket__description">{label.description}</p>
            <strong>No.{date}</strong>
          </div>
        </div>}>
        {qr && <img className="artwork-ticket__qr" src={qr} alt="扫描进入作品" draggable={false} />}
      </TearTicket>
    </div>
  </div>;
}
