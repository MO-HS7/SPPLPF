'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { demoStore } from '../../../../lib/demo/store';
import type { ContentType, WorkflowStatus } from '../../../../lib/demo/types';
import {
  Alert,
  Badge,
  Button,
  Card,
  FormField,
  Input,
  Select,
  Tabs,
  Textarea,
} from '../../../../components/ui';
import { IconCheck, IconChevronRight, IconGlobe, IconSave } from '../../../../components/icons';

export default function NewContentPage() {
  const router = useRouter();
  const [activeLangTab, setActiveLangTab] = useState('ar');

  // Form State
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [summaryAr, setSummaryAr] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [type, setType] = useState<ContentType>('news');
  const [category, setCategory] = useState('وساطة محلية / Local Mediation');
  const [status, setStatus] = useState<WorkflowStatus>('DRAFT');
  const [tagsInput, setTagsInput] = useState('وساطة, سلام, تعز');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-generate slug from English title or Romanized Arabic
  const handleTitleArChange = (val: string) => {
    setTitleAr(val);
    if (!slug) {
      setSlug(
        'art-' +
          val
            .trim()
            .substring(0, 30)
            .replace(/[^\w\s\u0621-\u064A]/gi, '')
            .replace(/\s+/g, '-')
      );
    }
  };

  const handleTitleEnChange = (val: string) => {
    setTitleEn(val);
    if (val) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!titleAr.trim()) newErrors.titleAr = 'العنوان العربي مطلوب';
    if (!slug.trim()) newErrors.slug = 'المعرف الرابطي (Slug) مطلوب';
    if (!summaryAr.trim()) newErrors.summaryAr = 'الملخص العربي مطلوب';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.titleAr || newErrors.summaryAr) {
        setActiveLangTab('ar');
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setTimeout(() => {
      const created = demoStore.saveContentItem({
        slug: slug.trim(),
        type,
        status,
        titleAr: titleAr.trim(),
        titleEn: titleEn.trim() || titleAr.trim(),
        summaryAr: summaryAr.trim(),
        summaryEn: summaryEn.trim() || summaryAr.trim(),
        bodyAr: bodyAr.trim() || summaryAr.trim(),
        bodyEn: bodyEn.trim() || summaryEn.trim() || summaryAr.trim(),
        category,
        author: 'فريق التحرير / Editorial Team',
        publishedAt: new Date().toISOString().split('T')[0],
        tags,
      });

      setIsSubmitting(false);
      router.push(`/admin/content`);
    }, 500);
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockEnd: '0.25rem' }}>
            <Link href="/admin/content" style={{ color: 'inherit' }}>إدارة المحتوى</Link>
            <IconChevronRight size={14} />
            <span>إضافة مادة جديدة</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', margin: 0 }}>
            إنشاء مادة جديدة (New Content Item)
          </h1>
        </div>

        <Link href="/admin/content" style={{ textDecoration: 'none' }}>
          <Button variant="outline" size="sm">إلغاء والعودة</Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.7fr)', gap: 'var(--space-8)' }} className="md-grid-cols-1">
          {/* Main Multilingual Editor Area */}
          <div>
            <Card style={{ padding: 'var(--space-6)' }}>
              {/* Language Switcher Tabs */}
              <div style={{ marginBlockEnd: 'var(--space-6)' }}>
                <Tabs
                  tabs={[
                    { id: 'ar', label: 'المحتوى العربي (العربية - رئيسي)' },
                    { id: 'en', label: 'English Translation (إنجليزي)' },
                  ]}
                  activeTab={activeLangTab}
                  onChange={setActiveLangTab}
                />
              </div>

              {/* Arabic Inputs */}
              {activeLangTab === 'ar' && (
                <div>
                  <FormField label="العنوان الرئيسي للمادة (عربي)" required error={errors.titleAr}>
                    <Input
                      value={titleAr}
                      onChange={(e) => handleTitleArChange(e.target.value)}
                      placeholder="اكتب عنوان البيان أو المقال أو النشاط بالعربية..."
                      error={!!errors.titleAr}
                    />
                  </FormField>

                  <FormField label="الملخص التنفيذي (عربي)" required error={errors.summaryAr}>
                    <Textarea
                      rows={3}
                      value={summaryAr}
                      onChange={(e) => setSummaryAr(e.target.value)}
                      placeholder="ملخص موجز يظهر في بطاقات الأخبار والصفحة الرئيسية..."
                      error={!!errors.summaryAr}
                    />
                  </FormField>

                  <FormField label="النص الكامل للمادة (عربي)">
                    <Textarea
                      rows={10}
                      value={bodyAr}
                      onChange={(e) => setBodyAr(e.target.value)}
                      placeholder="اكتب تفاصيل التقرير أو البيان الصحفي كاملاً هنا..."
                    />
                  </FormField>
                </div>
              )}

              {/* English Inputs */}
              {activeLangTab === 'en' && (
                <div dir="ltr">
                  <FormField label="Article Headline (English)">
                    <Input
                      value={titleEn}
                      onChange={(e) => handleTitleEnChange(e.target.value)}
                      placeholder="Enter the English headline..."
                    />
                  </FormField>

                  <FormField label="Executive Summary (English)">
                    <Textarea
                      rows={3}
                      value={summaryEn}
                      onChange={(e) => setSummaryEn(e.target.value)}
                      placeholder="Brief excerpt displayed on news cards..."
                    />
                  </FormField>

                  <FormField label="Full Article Body (English)">
                    <Textarea
                      rows={10}
                      value={bodyEn}
                      onChange={(e) => setBodyEn(e.target.value)}
                      placeholder="Enter the full English press release or narrative..."
                    />
                  </FormField>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar: Metadata & Workflow Publication Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <Card>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
                إعدادات النشر وحالة الاعتماد
              </h3>

              <FormField label="حالة مسار النشر (Status)">
                <Select value={status} onChange={(e) => setStatus(e.target.value as WorkflowStatus)}>
                  <option value="DRAFT">مسودة أولية (Draft)</option>
                  <option value="IN_REVIEW">إرسال للمراجعة (Submit for Review)</option>
                  <option value="APPROVED">معتمد للنشر (Approved)</option>
                  <option value="PUBLISHED">نشر فوري (Publish Live)</option>
                </Select>
              </FormField>

              <FormField label="نوع المحتوى (Content Type)">
                <Select value={type} onChange={(e) => setType(e.target.value as ContentType)}>
                  <option value="news">خبر أو بيان صحفي (News / Statement)</option>
                  <option value="activity">نشاط أو ورشة عمل (Field Activity)</option>
                  <option value="story">قصة نجاح وأثر (Impact Story)</option>
                </Select>
              </FormField>

              <FormField label="المعرف الرابطي (URL Slug)" required error={errors.slug}>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="article-url-slug"
                  error={!!errors.slug}
                />
              </FormField>

              <FormField label="المحور / التصنيف المؤسسي">
                <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="وساطة محلية / Local Mediation">وساطة محلية / Local Mediation</option>
                  <option value="سيادة القانون / Rule of Law">سيادة القانون / Rule of Law</option>
                  <option value="تمكين الشباب والنساء / Youth & Women">تمكين الشباب والنساء / Youth & Women</option>
                  <option value="نزاهة وحوكمة / Governance">نزاهة وحوكمة / Governance</option>
                  <option value="بيانات صحفية / Press Statements">بيانات صحفية / Press Statements</option>
                </Select>
              </FormField>

              <FormField label="الوسوم (مفصولة بفواصل)" hint="مثال: وساطة, تعز, حماية">
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </FormField>

              <div style={{ marginBlockStart: 'var(--space-6)' }}>
                <Button type="submit" variant="primary" style={{ width: '100%' }} isLoading={isSubmitting}>
                  <IconSave size={16} />
                  <span>حفظ المادة في المعاينة</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
