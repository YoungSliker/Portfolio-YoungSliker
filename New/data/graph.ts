import extraWorks from './graph-extra.json' with { type: 'json' };
// Prototype selection: existing project names and media, without inferred dates or roles.
export const graphGroups = [
  {id:'scenes',category:'aigc',label:'场景与叙事'},
  {id:'ai-video',category:'aigc',label:'视频'},
  {id:'ai-image',category:'aigc',label:'图片'},
  {id:'ai-tutorial',category:'aigc',label:'教程'},
  {id:'layout',category:'visual',label:'版面设计'},
  {id:'visual-video',category:'visual',label:'视频设计'},
  {id:'media',category:'digital',label:'新媒体交互'},
  {id:'apps',category:'digital',label:'APP 设计'},
  {id:'brand',category:'visual',label:'品牌设计'},
  {id:'logos',category:'visual',label:'LOGO 设计'},
];
const mainWorks = [
  {id:'suiyuan',group:'scenes',title:'绥远方志',cover:'AIGC/绥远方志.jpg',summary:'基于人智混合的呼和浩特史体验场景设计。',source:'用户确认 / 旧站主要案例'},
  {id:'mine-eco',group:'scenes',title:'矿山*生态',cover:'AIGC/矿山生态.jpg',summary:'基于 Depth AI 场景建模的 UE5 实机演示。',source:'用户确认 / 旧站主要案例'},
  {id:'weiyuan',group:'scenes',title:'微元灵溯',cover:'AIGC/微元灵溯.jpg',summary:'基于“隐性饥饿”的 AI 艺术可视化交互设计。',source:'用户确认 / 旧站主要案例'},
  {id:'shuyun',group:'media',title:'蜀韵天下',cover:'数字体验设计/新媒体艺术设计/展厅预览711/0.webp',summary:'川剧脸谱交互艺术设计。',source:'旧站新媒体作品清单'},
  {id:'kinect-face',group:'media',title:'Kinect 表情交互',cover:'数字体验设计/新媒体艺术设计/展厅预览711/1-0.webp',summary:'以表情为主题的 Kinect 交互实践。',source:'旧站新媒体作品清单'},
  {id:'kinect-water',group:'media',title:'Kinect 手势水交互',cover:'数字体验设计/新媒体艺术设计/展厅预览711/2-0.webp',summary:'以手势与水为主题的交互实践。',source:'旧站新媒体作品清单'},
  {id:'xueban',group:'apps',title:'学伴',cover:'数字体验设计/APP设计/学伴-线上学习行为习惯养成APP/学伴海报.png',summary:'线上学习行为习惯养成 APP 设计。',source:'旧站 APP 素材目录'},
  {id:'yanchage',group:'apps',title:'颜茶阁',cover:'数字体验设计/APP设计/颜茶阁-相面修复诊疗服务APP/闪屏页.png',summary:'相面修复诊疗服务 APP 设计。',source:'旧站 APP 素材目录'},
  {id:'zhucanbang',group:'apps',title:'助残帮',cover:'数字体验设计/APP设计/助残帮-残障人士特殊群体服务APP/海报.png',summary:'面向残障人士等特殊群体的服务 APP 设计。',source:'旧站 APP 素材目录'},
  {id:'kulun',group:'brand',title:'库伦荞麦',cover:'视觉传达设计/品牌设计/库伦荞麦/q1.png',summary:'库伦荞麦品牌设计。',source:'旧站视觉传达作品清单'},
  {id:'wanbu',group:'logos',title:'万部华严经塔',cover:'视觉传达设计/LOGO设计/万部华严经塔.jpg',summary:'万部华严经塔标志设计。',source:'旧站视觉传达作品清单'},
  {id:'guisui',group:'logos',title:'创意归绥',cover:'视觉传达设计/LOGO设计/创意归绥.jpg',summary:'创意归绥标志设计。',source:'旧站视觉传达作品清单'},
];

export const graphWorks = [...mainWorks.map(w=>({...w,date:({suiyuan:"2025.07","mine-eco":"2023.08",weiyuan:"2024.06"} as Record<string,string>)[w.id]??"",pending:false,original:w.cover})),...extraWorks];
