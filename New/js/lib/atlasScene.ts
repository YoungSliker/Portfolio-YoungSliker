import atlasUrl from '../../assets/images/intro/atlas-source.png';

export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const phase = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
export const smooth = (p: number) => p * p * (3 - 2 * p);
const mix = (a: number, b: number, p: number) => a + (b - a) * p;
type Dot = { x: number; y: number; brightness: number };
// Keep the person from the source diagram; redraw geometry independently.
const silhouette = [[137,438],[146,421],[174,386],[190,369],[170,358],[142,337],[142,312],[152,289],[161,270],[174,248],[203,230],[230,240],[250,239],[276,255],[305,240],[331,216],[344,190],[347,173],[359,167],[370,187],[358,204],[357,220],[340,249],[310,281],[279,293],[255,309],[226,325],[231,345],[248,359],[261,378],[272,402],[288,418],[305,427],[299,439],[261,445],[220,437],[190,443]];
function isFigure(x:number,y:number) {
  let inside=false;
  for(let i=0,j=silhouette.length-1;i<silhouette.length;j=i++) {
    const [a,b]=silhouette[i], [c,d]=silhouette[j];
    if((b>y)!==(d>y) && x<(c-a)*(y-b)/(d-b)+a)inside=!inside;
  }
  return inside;
}
export function ballPose(w: number, h: number, p: number, orbit?: {x:number; y:number; radius:number}) {
  const size = w < 768 ? Math.min(w * 1.12, h * .61) : Math.min(h * .92, w * .55);
  const left = w < 768 ? w * .5 - size * .5 : w * .24 - size * .5;
  const top = w < 768 ? h * .06 : h * .14;
  const roll = smooth(phase(p, 0, .26));
  const radius = size * .225;
  const cx = mix(left + .5 * size, w / 2, roll);
  // The topmost bright pixel settles exactly at the viewport center.
  const cy = mix(top + .3 * size, h * .5 + radius - 2, roll);
  const grow = smooth(phase(p,.24,.58));
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
  let resolveReady:()=>void=()=>{};
  const ready=new Promise<void>(resolve=>{resolveReady=resolve;});
  const spiralPath=document.createElementNS('http://www.w3.org/2000/svg','path');
  // Starts at the marked inner curl, then traces outward toward the shoulder.
  spiralPath.setAttribute('d','M 294 357 C 299 353 304 359 299 365 C 288 375 270 360 276 347 C 287 319 329 326 344 348 C 378 404 319 447 267 443 C 187 449 135 395 138 330 C 138 232 239 150 360 150');
  const pathLength=spiralPath.getTotalLength();
  const spiral=Array.from({length:Math.ceil(pathLength/2)},(_,i)=>spiralPath.getPointAtLength(i*2));
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
      if (brightness > .12 && isFigure(x,y)) dots.push({ x, y, brightness });
    }
    canvas.dataset.ready = 'true';
    resolveReady();
  };
  img.onerror = () => { canvas.dataset.ready = 'error'; resolveReady(); };
  img.src = atlasUrl;
  let w = 0, h = 0;
  return {
    ready,
    resize(width: number, height: number) {
      w = width; h = height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    },
    draw(p: number, time: number, orbit: {x:number; y:number; radius:number}, entrance:{figure:number;ball:number;spiral:number}) {
      if (!ctx || !w || !h) return;
      ctx.clearRect(0, 0, w, h);
      const mobile = w < 768;
      ctx.globalAlpha = 1;
      const {size,left,top,roll,radius,cx,cy} = ballPose(w,h,p,orbit);
      const figureOpacity = entrance.figure * (1 - phase(p, .12, .28));
      if (figureOpacity > 0) {
        ctx.fillStyle = '#c5c5c5';
        for (const dot of dots) {
          ctx.globalAlpha = figureOpacity * dot.brightness;
          const x = left + dot.x / 500 * size, y = top + dot.y / 500 * size;
          ctx.beginPath(); ctx.arc(x, y, Math.max(.45, size / 500 * .72), 0, Math.PI * 2); ctx.fill();
        }
      }
      const lineFade=1-smooth(phase(p,0,.25));
      ctx.fillStyle='#b7bdc0';ctx.globalAlpha=.65*lineFade;
      for(let i=0;i<Math.floor(spiral.length*entrance.spiral);i++) {
        const point=spiral[i];ctx.beginPath();ctx.arc(left+point.x/500*size,top+point.y/500*size,Math.max(.6,size/500*.65),0,Math.PI*2);ctx.fill();
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
      const fade = entrance.ball * (1 - smooth(phase(p, .26, .36)));
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

