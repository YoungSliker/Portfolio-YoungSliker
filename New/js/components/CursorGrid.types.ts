import type { CSSProperties, ReactNode } from 'react';
export interface CursorGridProps {
  cellSize?: number; color?: string; gridColor?: string; radius?: number;
  falloff?: 'linear' | 'smooth' | 'sharp'; highlight?: 'cell' | 'area';
  holdTime?: number; fadeDuration?: number; lineWidth?: number; maxOpacity?: number;
  fillOpacity?: number; gridOpacity?: number; gridStyle?: 'lines' | 'dashed' | 'dots' | 'crosses';
  cellRadius?: number; cellGap?: number; spotlight?: number; clickPulse?: boolean;
  pulseSpeed?: number; ambient?: number; edgeFade?: number; intro?: boolean;
  lightMode?: boolean; dpr?: number; children?: ReactNode; className?: string; style?: CSSProperties;
}
