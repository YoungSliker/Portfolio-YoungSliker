import atlasUrl from '../../assets/images/intro/atlas-source.png';

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const phase = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
export const smooth = (p: number) => p * p * (3 - 2 * p);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
type Dot = { x: number; y: number; brightness: number };
export function ballPose(w: number, h: number, p: number, orbit?: {x:number; y:number; radius:number}) {
  const size = w < 768 ? Math.min(w * 1.12, h * .61) : Math.min(h * .92, w * .55);
  const left = w < 768 ? w * .5 - size * .5 : w * .24 - size * .5;
  const top = w < 768 ? h * .06 : h * .14;
  const roll = smooth(phase(p, 0, .26));
  const radius = size * .225;
  const cx = mix(left + .5 * size, w / 2, roll);
  // The topmost bright pixel settles exactly at the viewport center.
  const cy = mix(top + .3 * size, h * .5 + radius - 2, roll);
  const grow = smooth(phase(p,.36,.58));
  const align = smooth(phase(p,.4,.58));
  const dotRadius = 2 + grow * ((orbit?.radius ?? 185) - 2);
  const dotX = mix(cx,orbit?.x ?? w / 2,align);
  const dotY = mix(cy - radius + 2,orbit?.y ?? h / 2,align);
  // The globe keeps its size; only the surviving meteor pixel grows.
  return {size,left,top,roll,radius,cx,
    cy,dotX,dotY,dotRadius};
}

// Original figure from the user-supplied Hero ASCII One scene. The sphere and
// scrolling are rendered locally so the ball can move independently of the figure.
export function createAtlasScene(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  let dots: Dot[] = [];
  let disposed = false;
  const img = new Image();
  img.onload = () => {
    if (disposed) return;
    const sampler = document.createElement('canvas');
    sampler.width = sampler.height = 500;
    const source = sampler.getContext('2d', { willReadFrequently: true })!;
    source.drawImage(img, 0, 0, 500, 500);
    const pixels = source.getImageData(0, 0, 500, 500).data;
    for (let y = 0; y < 500; y += 2) for (let x = 0; x < 500; x += 2) {
      const at = (y * 500 + x) * 4;
      const brightness = pixels[at] / 255 * pixels[at + 3] / 255;
      if (brightness > .12) dots.push({ x, y, brightness });
    }
    canvas.dataset.ready = 'true';
  };
  img.onerror = () => { canvas.dataset.ready = 'error'; };
  img.src = atlasUrl;
  let w = 0, h = 0;
  return {
    resize(width: number, height: number) {
      w = width; h = height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    draw(p: number, time: number, orbit: {x:number; y:number; radius:number}) {
      if (!ctx || !w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const mobile = w < 768;
      ctx.globalAlpha = 1;
      const {size,left,top,roll,radius,cx,cy} = ballPose(w,h,p,orbit);
      const figureOpacity = 1 - phase(p, .12, .28);
      if (figureOpacity > 0) {
        ctx.fillStyle = '#c5c5c5';
        for (const dot of dots) {
          // Diagram lines above the shoulder fade as the sphere leaves the hand.
          const diagram = dot.y < 230 && !(dot.x > 340 && dot.y > 170);
          ctx.globalAlpha = figureOpacity * dot.brightness * (diagram ? 1 - phase(p, .015, .09) : 1);
          const x = left + dot.x / 500 * size, y = top + dot.y / 500 * size;
          ctx.beginPath(); ctx.arc(x, y, Math.max(.45, size / 500 * .72), 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      const rotation = roll * 2.5 + time * .065 * (1 - roll);
      // Keep the dot lattice attached to the globe while it rolls and fades.
      // Cull offscreen dots without resetting the grid origin at the viewport edge.
      const step = mobile ? 5 : 6;
      const originX = cx - radius, originY = cy - radius;
      const leftEdge = originX + Math.max(0, Math.ceil((-step - originX) / step)) * step;
      const topEdge = originY + Math.max(0, Math.ceil((-step - originY) / step)) * step;
      const rightEdge = Math.min(w + step, cx + radius);
      const bottomEdge = Math.min(h + step, cy + radius);
      const fade = 1 - smooth(phase(p, .26, .36));
      ctx.fillStyle = '#e0e0dc';
      for (let y = topEdge; y < bottomEdge; y += step) for (let x = leftEdge; x < rightEdge; x += step) {
        const nx = (x - cx) / radius, ny = (y - cy) / radius;
        const rr = nx * nx + ny * ny;
        if (rr >= 1) continue;
        const nz = Math.sqrt(1 - rr);
        const u = nx * Math.cos(rotation) + nz * Math.sin(rotation);
        const v = nz * Math.cos(rotation) - nx * Math.sin(rotation);
        const terrain = Math.sin(u * 9 + Math.sin(ny * 7) * 1.7) + Math.cos(ny * 12 + v * 6) * .7;
        const light = Math.max(.04, -.35 * nx - .4 * ny + .8 * nz);
        const luminance = .13 + light * (terrain > .25 ? .86 : .3);
        ctx.globalAlpha = luminance * fade;
        ctx.beginPath(); ctx.arc(x, y, step * (.09 + luminance * .31), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
    dispose() { disposed = true; img.onload = img.onerror = null; dots = []; },
  };
}

