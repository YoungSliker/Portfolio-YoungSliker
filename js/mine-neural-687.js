(()=>{
// Original flowing cellular field inspired by the supplied recording.
const page=document.getElementById('mine-eco-detail');if(!page)return;
const canvas=document.createElement('canvas');canvas.className='mine-neural-field';canvas.setAttribute('aria-hidden','true');page.prepend(canvas);
const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false});if(!gl){canvas.remove();return}
const vs='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const fs=`precision mediump float;
uniform vec2 resolution;uniform float time;
vec2 hash(vec2 p){return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);}
void main(){
 vec2 uv=gl_FragCoord.xy/resolution;vec2 q=(uv-.5)*vec2(resolution.x/resolution.y,1.)*3.2;
 q+=.55*vec2(sin(q.y*2.2+time*.23),cos(q.x*1.8-time*.19));
 q+=.10*vec2(sin(q.y*5.1-q.x*2.+time*.16),cos(q.x*4.2+q.y*2.5-time*.12));
 vec2 cell=floor(q),f=fract(q);float a=10.,b=10.,c=10.;
 for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){
 vec2 g=vec2(float(x),float(y));vec2 h=hash(cell+g);vec2 pos=.5+.34*sin(time*.22+6.2831*h);float d=length(g+pos-f);
 if(d<a){c=b;b=a;a=d;}else if(d<b){c=b;b=d;}else if(d<c){c=d;}
 }}
 float edge=b-a;
 float flow=.5+.5*sin(q.x*2.7+sin(q.y*2.3)+time*.17);
 float junction=exp(-(c-a)*8.);
 float width=mix(.18,8.5,pow(flow,3.))+junction*12.;
 float core=exp(-edge*85./width);
 float haze=exp(-edge*18./max(.5,width*.7));
 float filament=exp(-abs(edge-.026*sin(q.x*8.+q.y*5.+time*.3))*160.)*.13;
 float node=exp(-(c-a)*14.);
 float breaks=smoothstep(-.45,.45,sin(q.y*2.1-q.x*1.6+sin(q.x*2.4)+time*.12));
 float pulse=.75+.25*sin(time*.65+q.x*2.+q.y*1.4);
 float strength=(core*.24+haze*.20+filament+node*.10)*pulse*mix(.04,1.,breaks);
 float margin=mix(.35,1.,smoothstep(.18,.49,abs(uv.x-.5)));
 vec3 color=mix(vec3(.20,.52,.29),vec3(.66,.88,.37),min(1.,core+node));
 gl_FragColor=vec4(color,strength*margin*.32);
}`;
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))return null;return s}
const v=shader(gl.VERTEX_SHADER,vs),f=shader(gl.FRAGMENT_SHADER,fs);if(!v||!f){canvas.remove();return}
const program=gl.createProgram();gl.attachShader(program,v);gl.attachShader(program,f);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS)){canvas.remove();return}gl.useProgram(program);
const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
const size=gl.getUniformLocation(program,'resolution'),clock=gl.getUniformLocation(program,'time');let raf=0,last=0,elapsed=0;const reduced=matchMedia('(prefers-reduced-motion:reduce)');
function draw(){gl.uniform2f(size,canvas.width,canvas.height);gl.uniform1f(clock,elapsed*.72);gl.drawArrays(gl.TRIANGLES,0,6)}
function resize(){canvas.width=Math.round(innerWidth*.65);canvas.height=Math.round(innerHeight*.65);gl.viewport(0,0,canvas.width,canvas.height);draw()}
function tick(now){raf=0;if(document.hidden||page.style.display!=='block'||reduced.matches)return;if(now-last>=33){elapsed+=Math.min((now-last)/1000,.06);last=now;draw()}raf=requestAnimationFrame(tick)}
function sync(){cancelAnimationFrame(raf);raf=0;last=performance.now();if(page.style.display==='block'&&!document.hidden){resize();if(!reduced.matches)raf=requestAnimationFrame(tick)}}
window.addEventListener('mine-eco-open',sync);window.addEventListener('mine-eco-close',sync);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);window.addEventListener('resize',resize);resize();
})();
