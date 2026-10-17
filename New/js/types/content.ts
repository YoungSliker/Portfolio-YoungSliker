export type CategoryId = 'aigc' | 'digital' | 'visual';
export interface Work {
  id: string;
  title: string;
  titleEn?: string;
  category: CategoryId;
  subcategory: string;
  year: number | null;
  dateLabel?: string;
  summary: string;
  responsibilities: string[];
  skills: string[];
  cover: string;
  previewVideo?: string;
  detailUrl: string | null;
  status: 'published' | 'incomplete' | 'needs-review';
  featured: boolean;
  source: string;
}
export interface JourneyEntry {
  id: string;
  kind: 'education' | 'work' | 'project' | 'award';
  title: string;
  organization: string;
  dateLabel: string | null;
  description: string;
  relatedWorkIds: string[];
  status: 'verified' | 'needs-review';
}
