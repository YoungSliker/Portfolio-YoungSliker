import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import TearTicket from './TearTicket';
import '../../css/artwork-ticket.css';

export function ArtworkTicket({ title, description, date, image, qrValue, width, height }: {
  title: string; description: string; date: string; image?: string; qrValue: string; width: number; height: number;
}) {
  const vertical = height > width;
  const [qr, setQr] = useState('');
  useEffect(() => { QRCode.toDataURL(qrValue, { margin: 0, width: 72, color: { dark: '#d94a1c', light: '#fff1e2' } }).then(setQr); }, [qrValue]);
  return <div className="artwork-ticket">
    <TearTicket image={image} imageAlt={title + '作品图像'}
      width={width} height={height} orientation={vertical ? 'vertical' : 'horizontal'}
      stubSize={vertical ? 108 : 84} scrim={false} imageRadius={7}
      radius={0} holes={10} holeSize={4} notch={3} roughness={0}
      tearAngle={30} stretch={20} resistance={.45} rotate={0}
      tilt tiltMax={5} tiltReach={180} parallax={4} perspective={1000}
      background="#fffaf4" stubBackground="#fff1e2" color="#d94a1c"
      border borderColor="#d94a1c55" borderWidth={1} recenter
      ariaLabel={'撕开' + title + '作品票根'}
      stub={<div className="artwork-ticket__stub">
        <p className="artwork-ticket__description">{description}</p>
        {qr && <img className="artwork-ticket__qr" src={qr} alt="扫描进入作品" />}
        <strong>No.{date}</strong>
      </div>}>
      <div className="artwork-ticket__caption"><h2>{title}</h2></div>
    </TearTicket>
  </div>;
}
