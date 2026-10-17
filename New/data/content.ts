import type { Work } from '../js/types/content';

export const sections = [
  { id: 'hero', label: '封面', en: 'INTRO' },
  { id: 'about', label: '关于', en: 'ABOUT' },
  { id: 'journey', label: '经历', en: 'JOURNEY' },
  { id: 'works', label: '作品', en: 'WORKS' },
  { id: 'showcase', label: '多端', en: 'SCREENS' },
  { id: 'contact', label: '联系', en: 'CONTACT' },
] as const;
export type SectionId = typeof sections[number]['id'];

export const categories = [
  { id: 'aigc', number: '01', title: 'AIGC DESIGN', label: '人工智能生成设计', description: '生成式视觉、AI 创作、实时场景与数字叙事。' },
  { id: 'digital', number: '02', title: 'DIGITAL EXPERIENCE', label: '数字体验设计', description: '新媒体艺术、交互装置、APP 设计与用户体验。' },
  { id: 'visual', number: '03', title: 'VISUAL COMMUNICATION', label: '视觉传达设计', description: '品牌识别、版面设计、信息可视化与视觉系统。' },
] as const;

export const featuredWorks: Work[] = [
  { id: 'suiyuan', title: '绥远方志', category: 'aigc', subcategory: '沉浸式历史体验', cover: 'AIGC/绥远方志.jpg' },
  { id: 'mine-eco', title: '矿山*生态', category: 'aigc', subcategory: '生态主题创作', cover: 'AIGC/矿山生态.jpg' },
  { id: 'weiyuan', title: '微元灵溯', category: 'aigc', subcategory: '维生素交互科普游戏', cover: 'AIGC/微元灵溯.jpg' },
].map(work => ({ ...work, category: 'aigc', year: null, summary: '', responsibilities: [], skills: [],
  detailUrl: null, status: 'needs-review', featured: true, source: '旧站 index.html 与 AIGC 素材目录' }));
