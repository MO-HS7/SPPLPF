import { describe, expect, it } from 'vitest';
import { getDictionary, getDirection, isValidLocale, switchLocalePath } from '../../../src/lib/i18n';
import { demoStore } from '../../../src/lib/demo/store';

describe('Frontend Prototype: i18n & Localization Engine', () => {
  it('validates supported locales and falls back accurately', () => {
    expect(isValidLocale('ar')).toBe(true);
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('fr')).toBe(false);
  });

  it('resolves correct direction for Arabic and English', () => {
    expect(getDirection('ar')).toBe('rtl');
    expect(getDirection('en')).toBe('ltr');
  });

  it('retrieves complete dictionaries with navigation keys', () => {
    const arDict = getDictionary('ar');
    const enDict = getDictionary('en');

    expect(arDict.nav.home).toBe('الرئيسية');
    expect(enDict.nav.home).toBe('Home');
    expect(arDict.direction).toBe('rtl');
    expect(enDict.direction).toBe('ltr');
    expect(arDict.common.orgName).toContain('تعزيز السلام');
    expect(enDict.common.orgName).toContain('Peace, Protection and Law');
  });

  it('switches route pathname locale retaining target sub-path', () => {
    expect(switchLocalePath('/ar', 'en')).toBe('/en');
    expect(switchLocalePath('/ar/about/values', 'en')).toBe('/en/about/values');
    expect(switchLocalePath('/en/programs/local-mediation', 'ar')).toBe('/ar/programs/local-mediation');
    expect(switchLocalePath('/en/contact', 'ar')).toBe('/ar/contact');
  });
});

describe('Frontend Prototype: Reactive Demo Store & Operations', () => {
  it('loads default demo items for programs, news, publications, and offices', () => {
    demoStore.resetToDefaults();
    const programs = demoStore.getPrograms();
    const content = demoStore.getContentItems();
    const publications = demoStore.getPublications();
    const offices = demoStore.getOffices();

    expect(programs.length).toBeGreaterThanOrEqual(4);
    expect(content.length).toBeGreaterThanOrEqual(6);
    expect(publications.length).toBeGreaterThanOrEqual(3);
    expect(offices.length).toBe(3);
  });

  it('supports simulated contact inquiry submissions', () => {
    const created = demoStore.addInquiry({
      fullName: 'Test Citizen',
      email: 'citizen@example.org',
      phone: '+967 777 000 111',
      subject: 'Legal Aid Request',
      category: 'Legal Aid',
      message: 'Need urgent consultation regarding detention.',
    });

    expect(created.id).toBeDefined();
    expect(created.status).toBe('NEW');

    const allInquiries = demoStore.getInquiries();
    expect(allInquiries.some((i) => i.id === created.id)).toBe(true);

    // update status
    demoStore.updateInquiryStatus(created.id, 'IN_REVIEW', 'Assigned to defense attorney');
    const updated = demoStore.getInquiries().find((i) => i.id === created.id);
    expect(updated?.status).toBe('IN_REVIEW');
    expect(updated?.notes).toBe('Assigned to defense attorney');
  });

  it('supports workflow status transitions (Draft -> Review -> Publish)', () => {
    const item = demoStore.saveContentItem({
      slug: 'test-community-pact',
      type: 'news',
      status: 'DRAFT',
      titleAr: 'اتفاق مجتمعي تجريبي',
      titleEn: 'Test Community Pact',
      summaryAr: 'ملخص تجريبي',
      summaryEn: 'Test Summary',
      bodyAr: 'نص تجريبي',
      bodyEn: 'Test Body',
      category: 'وساطة محلية',
      author: 'Tester',
      tags: ['test'],
    });

    expect(item.status).toBe('DRAFT');

    // Submit for review
    demoStore.updateContentStatus(item.id, 'IN_REVIEW', 'Ready for editorial review');
    expect(demoStore.getContentItemById(item.id)?.status).toBe('IN_REVIEW');

    // Approve
    demoStore.updateContentStatus(item.id, 'APPROVED');
    expect(demoStore.getContentItemById(item.id)?.status).toBe('APPROVED');

    // Publish
    demoStore.updateContentStatus(item.id, 'PUBLISHED');
    expect(demoStore.getContentItemById(item.id)?.status).toBe('PUBLISHED');
  });

  it('supports user role assignment across the 4 canonical roles', () => {
    const users = demoStore.getUsers();
    const authorUser = users.find((u) => u.role === 'CONTENT_AUTHOR');
    expect(authorUser).toBeDefined();

    if (authorUser) {
      demoStore.updateUserRole(authorUser.id, 'CONTENT_MANAGER');
      const updatedUser = demoStore.getUsers().find((u) => u.id === authorUser.id);
      expect(updatedUser?.role).toBe('CONTENT_MANAGER');
    }
  });

  it('resets store data cleanly to default state', () => {
    demoStore.resetToDefaults();
    const content = demoStore.getContentItems();
    expect(content.some((c) => c.slug === 'test-community-pact')).toBe(false);
  });
});
