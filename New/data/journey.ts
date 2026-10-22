export interface TimelineEntry {
  id:string; year:string; date:string; kind:string; title:string; organization:string;
  description:string; tags:string[]; source:string; confirmed:boolean; workId?:string;
}
// Explicit source dates only; asset filenames are not evidence of completion.
const practiceEntries:TimelineEntry[] = [
  {id:'education',year:'2021',date:'2021.09 — 2025.06',kind:'教育',title:'数字媒体艺术',organization:'内蒙古师范大学',description:'数字媒体艺术专业，已毕业。学习数字动态影像、信息交互、影视特效与后期制作，课程涵盖用户体验、人工智能与创新设计、界面设计及品牌与新媒体。',tags:['数字媒体艺术','用户体验','影像创作','普通全日制本科','双一流专业'],source:'用户提供简历：教育背景',confirmed:true},
  {id:'mine',year:'2023',date:'2023.08',kind:'项目',title:'矿山*生态',organization:'创作实践',description:'基于 Depth AI 场景建模的 UE5 实机演示。',tags:['Depth AI','UE5','场景建模'],source:'用户提供作品说明及 No.202308',confirmed:true,workId:'mine-eco'},
  {id:'arti',year:'2024',date:'2024.03',kind:'项目',title:'ARTI 人工智能艺术教育教程',organization:'中国人工智能艺术教育协同创新平台',description:'ARTI 平台讲解及人工智能教育联盟公众号教程制作。内容涵盖基础图像生成、产品与交互设计、平面与视觉设计、装置与公共艺术的图像生成教程。',tags:['AI 教程','生成式视觉'],source:'用户提供简历：项目经历，2024.03',confirmed:true},
  {id:'lingsu',year:'2024',date:'2024.06',kind:'项目',title:'微元灵溯',organization:'创作实践',description:'基于“隐性饥饿”的 AI 艺术可视化交互设计。',tags:['AI 艺术','可视化','交互设计'],source:'用户提供作品说明及 No.202406',confirmed:true,workId:'weiyuan'},
  {id:'internship',year:'2024',date:'2024.08 — 2024.10',kind:'实习',title:'AIGC 设计师',organization:'上海脸谱心智',description:'参与 AI 动画、宣发物料与模拟器设计，优化 ComfyUI 工作流并使用 PyQt 开发界面。',tags:['ComfyUI','AI 动画','视觉物料','PyQt'],source:'用户提供简历：工作经历',confirmed:true},
  {id:'earthquake',year:'2024',date:'2024.11 — 2024.12',kind:'项目',title:'小马博士讲故事',organization:'内蒙古自治区地震局',description:'“炫动文创联‘萌’守护地震安全”（第二季）——小马博士讲故事活动断层成果应用。制作系列视频，传播活动断层探测成果的应用及减轻地震灾害损失的知识。',tags:['地震科普','系列视频'],source:'用户提供简历：项目经历',confirmed:true},
  {id:'suiyuan',year:'2025',date:'2025.01 — 2025.07',kind:'项目',title:'绥远方志',organization:'“创意内蒙古”设计赋能呼和浩特',description:'以呼和浩特不同时期的史志为内容，设计沉浸式交互系统。使用 AIGC 制作图像、音频、视频、模型、代码与文本，并通过 Unity 整合；结合强化学习智能体、3D 打印与 Pico Neo3 VR 构建体验。',tags:['AIGC','Unity','智能体','VR'],source:'用户提供简历项目经历；完成月份另由用户确认为 2025.07',confirmed:true,workId:'suiyuan'},
];
// No invented dates or individual/team attribution.
export const journeyAwards = [
  {date:'2022.09',title:'第八届中国国际“互联网+”大学生创新创业大赛',result:'省级银奖',project:'“青年红色筑梦之旅”赛道'},
  {date:'2024.06',title:'第一届亚洲大学生创意设计展',result:'“亚创大赛”一等奖',project:'元宇宙空间设计：生成式人工智能打造全新数字化虚拟沉浸式体验空间'},
];
export const journeyEntries:TimelineEntry[] = [...practiceEntries,...journeyAwards.map((award,index)=>({id:`award-${index}`,year:award.date.slice(0,4),date:award.date,kind:'获奖',title:award.result,organization:award.title,description:award.project,tags:['荣誉'],source:'用户确认日期与简历',confirmed:true}))].sort((a,b)=>a.date.localeCompare(b.date));
export const journeyYears = [...new Set(journeyEntries.map(entry=>entry.year))];
