import {legacyAsset} from '../lib/assets';
const appRoot='数字体验设计/APP设计/';
const asset=(path:string)=>legacyAsset(appRoot+path,import.meta.env.BASE_URL);
export function AppPreview({id}:{id:string}){
 if(id==='xueban')return <div className="graph-app-preview graph-app-preview--native"><video src={asset('学伴-线上学习行为习惯养成APP/闪屏.mp4')} autoPlay muted loop playsInline controls={false} aria-label="学伴引导页"/></div>;
 return <div className="graph-app-preview"><img className="graph-phone-frame" src={asset('框.png')} alt=""/>
 <div className="graph-phone-screen">{id==='yanchage'?<img src={asset('颜茶阁-相面修复诊疗服务APP/引导页/引导页1.png')} alt="颜茶阁引导页"/>:<video src={asset('助残帮-残障人士特殊群体服务APP/闪屏页.mp4')} autoPlay muted loop playsInline controls={false} aria-label="助残帮引导页"/>}</div><i className="graph-phone-island" aria-hidden="true"/></div>;
}
