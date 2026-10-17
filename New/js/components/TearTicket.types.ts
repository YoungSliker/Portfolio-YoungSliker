import type { ReactNode } from 'react';
export interface TearTicketProps {
  children?: ReactNode; stub?: ReactNode; image?: string; imageAlt?: string;
  orientation?: 'horizontal' | 'vertical'; scrim?: boolean; imageRadius?: number;
  torn?: boolean; defaultTorn?: boolean; onTear?: () => void;
  width?: number; height?: number; stubSize?: number; radius?: number;
  holes?: number; holeSize?: number; notch?: number; roughness?: number;
  tearAngle?: number; stretch?: number; resistance?: number; rotate?: number;
  tilt?: boolean; tiltMax?: number; tiltReach?: number; parallax?: number;
  perspective?: number; background?: string; color?: string; border?: boolean;
  borderColor?: string; borderWidth?: number; stubBackground?: string;
  recenter?: boolean; disabled?: boolean; ariaLabel?: string; className?: string;
}
