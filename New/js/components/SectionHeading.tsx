import BlurText from './BlurText';
import type { ReactNode } from 'react';

export function SectionHeading({ number, label, children }: { number: string; label: string; children: ReactNode }) {
  return <div className="section-heading">
    <p className="eyebrow"><span><BlurText text={`${number} /`}/></span> <BlurText text={label}/></p>
    <h2>{children}</h2>
  </div>;
}
