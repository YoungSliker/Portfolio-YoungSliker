import type { ReactNode } from 'react';

export function SectionHeading({ number, label, children }: { number: string; label: string; children: ReactNode }) {
  return <div className="section-heading">
    <p className="eyebrow"><span>{number} /</span> {label}</p>
    <h2>{children}</h2>
  </div>;
}
