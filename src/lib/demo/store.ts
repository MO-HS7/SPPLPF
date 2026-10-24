import {
  INITIAL_AUDIT_LOGS,
  INITIAL_CONTENT_ITEMS,
  INITIAL_INQUIRIES,
  INITIAL_OFFICES,
  INITIAL_PROGRAMS,
  INITIAL_PUBLICATIONS,
  INITIAL_USERS,
} from './fixtures';
import type {
  AuditLogDemo,
  ContentItemDemo,
  InquiryDemo,
  InquiryStatus,
  OfficeDemo,
  ProgramDemo,
  PublicationDemo,
  RoleName,
  UserDemo,
  WorkflowStatus,
} from './types';

const STORAGE_KEY = 'spplpf_demo_store_v1';

export interface DemoStoreData {
  contentItems: ContentItemDemo[];
  programs: ProgramDemo[];
  publications: PublicationDemo[];
  offices: OfficeDemo[];
  inquiries: InquiryDemo[];
  users: UserDemo[];
  auditLogs: AuditLogDemo[];
}

function getDefaultStoreData(): DemoStoreData {
  return {
    contentItems: [...INITIAL_CONTENT_ITEMS],
    programs: [...INITIAL_PROGRAMS],
    publications: [...INITIAL_PUBLICATIONS],
    offices: [...INITIAL_OFFICES],
    inquiries: [...INITIAL_INQUIRIES],
    users: [...INITIAL_USERS],
    auditLogs: [...INITIAL_AUDIT_LOGS],
  };
}

class DemoStore {
  private data: DemoStoreData = getDefaultStoreData();
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.data = JSON.parse(stored);
      } else {
        this.persist();
      }
    } catch {
      this.data = getDefaultStoreData();
    }
    this.initialized = true;
  }

  private persist() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore quota or disabled storage in restricted test environments
    }
  }

  private notify() {
    this.persist();
    for (const listener of this.listeners) {
      try {
        listener();
      } catch (err) {
        console.error('DemoStore listener error:', err);
      }
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public resetToDefaults(): void {
    this.data = getDefaultStoreData();
    this.notify();
  }

  // Content Items
  public getContentItems(): ContentItemDemo[] {
    return [...this.data.contentItems];
  }

  public getContentItemById(id: string): ContentItemDemo | undefined {
    return this.data.contentItems.find((c) => c.id === id);
  }

  public getContentItemBySlug(slug: string): ContentItemDemo | undefined {
    return this.data.contentItems.find((c) => c.slug === slug);
  }

  public saveContentItem(
    item: Omit<ContentItemDemo, 'id' | 'updatedAt' | 'publishedAt'> & { id?: string; publishedAt?: string }
  ): ContentItemDemo {
    const now = new Date().toISOString().split('T')[0];
    if (item.id) {
      const index = this.data.contentItems.findIndex((c) => c.id === item.id);
      if (index !== -1) {
        const updated: ContentItemDemo = {
          ...this.data.contentItems[index],
          ...item,
          id: item.id,
          updatedAt: now,
        };
        this.data.contentItems[index] = updated;
        this.logAudit('CONTENT_UPDATE', `Updated content item: ${updated.slug}`);
        this.notify();
        return updated;
      }
    }
    const newId = `cnt-${String(this.data.contentItems.length + 1).padStart(3, '0')}`;
    const created: ContentItemDemo = {
      ...item,
      id: newId,
      publishedAt: item.publishedAt || now,
      updatedAt: now,
    };
    this.data.contentItems.unshift(created);
    this.logAudit('CONTENT_CREATE', `Created content item: ${created.slug}`);
    this.notify();
    return created;
  }

  public updateContentStatus(id: string, status: WorkflowStatus, reviewNotes?: string): boolean {
    const item = this.data.contentItems.find((c) => c.id === id);
    if (!item) return false;
    item.status = status;
    item.updatedAt = new Date().toISOString().split('T')[0];
    if (reviewNotes !== undefined) {
      item.reviewNotes = reviewNotes;
    }
    this.logAudit('WORKFLOW_TRANSITION', `Changed status of [${item.slug}] to ${status}`);
    this.notify();
    return true;
  }

  // Programs
  public getPrograms(): ProgramDemo[] {
    return [...this.data.programs];
  }

  public getProgramBySlug(slug: string): ProgramDemo | undefined {
    return this.data.programs.find((p) => p.slug === slug);
  }

  // Publications
  public getPublications(): PublicationDemo[] {
    return [...this.data.publications];
  }

  // Offices
  public getOffices(): OfficeDemo[] {
    return [...this.data.offices];
  }

  // Inquiries
  public getInquiries(): InquiryDemo[] {
    return [...this.data.inquiries];
  }

  public addInquiry(inquiry: Omit<InquiryDemo, 'id' | 'status' | 'submittedAt'>): InquiryDemo {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newId = `inq-${String(this.data.inquiries.length + 1).padStart(3, '0')}`;
    const created: InquiryDemo = {
      ...inquiry,
      id: newId,
      status: 'NEW',
      submittedAt: now,
    };
    this.data.inquiries.unshift(created);
    this.notify();
    return created;
  }

  public updateInquiryStatus(id: string, status: InquiryStatus, notes?: string): boolean {
    const inq = this.data.inquiries.find((i) => i.id === id);
    if (!inq) return false;
    inq.status = status;
    if (notes !== undefined) {
      inq.notes = notes;
    }
    this.notify();
    return true;
  }

  // Users
  public getUsers(): UserDemo[] {
    return [...this.data.users];
  }

  public updateUserRole(id: string, role: RoleName): boolean {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return false;
    user.role = role;
    this.logAudit('USER_ROLE_CHANGE', `Changed role of [${user.email}] to ${role}`);
    this.notify();
    return true;
  }

  public toggleUserActive(id: string): boolean {
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return false;
    user.isActive = !user.isActive;
    this.logAudit('USER_STATUS_CHANGE', `Toggled active state of [${user.email}] to ${user.isActive}`);
    this.notify();
    return true;
  }

  // Audit Logs
  public getAuditLogs(): AuditLogDemo[] {
    return [...this.data.auditLogs];
  }

  private logAudit(action: string, details: string) {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLogDemo = {
      id: `aud-${String(this.data.auditLogs.length + 1).padStart(3, '0')}`,
      actor: 'admin@spplpf.org (SUPER_ADMIN)',
      action,
      entity: 'DemoSubsystem',
      details,
      timestamp: now,
    };
    this.data.auditLogs.unshift(newLog);
  }
}

export const demoStore = new DemoStore();
