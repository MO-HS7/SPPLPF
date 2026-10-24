export type ContentType = 'news' | 'activity' | 'story';
export type WorkflowStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED';
export type ProgramStatus = 'ACTIVE' | 'COMPLETED' | 'PLANNING';
export type InquiryStatus = 'NEW' | 'IN_REVIEW' | 'RESPONDED' | 'ARCHIVED';
export type RoleName = 'SUPER_ADMIN' | 'CONTENT_MANAGER' | 'CONTENT_AUTHOR' | 'AUDITOR';

export interface ContentItemDemo {
  id: string;
  slug: string;
  type: ContentType;
  status: WorkflowStatus;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  bodyAr: string;
  bodyEn: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  coverImage?: string;
  reviewNotes?: string;
}

export interface ProgramDemo {
  id: string;
  slug: string;
  pillar: 'mediation' | 'legal' | 'empowerment' | 'governance';
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  objectivesAr: string[];
  objectivesEn: string[];
  location: string;
  status: ProgramStatus;
  featured: boolean;
  coverImage?: string;
}

export interface PublicationDemo {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  summaryEn: string;
  category: string;
  publishedAt: string;
  pages: number;
  fileSize: string;
  downloadCount: number;
}

export interface OfficeDemo {
  id: string;
  slug: string;
  cityAr: string;
  cityEn: string;
  roleAr: string;
  roleEn: string;
  addressAr: string;
  addressEn: string;
  scopeAr: string;
  scopeEn: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
}

export interface InquiryDemo {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  category: string;
  status: InquiryStatus;
  submittedAt: string;
  notes?: string;
}

export interface UserDemo {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  isActive: boolean;
  lastLoginAt: string;
}

export interface AuditLogDemo {
  id: string;
  actor: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}
