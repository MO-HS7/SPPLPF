'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useDemoStore } from '../../../../lib/demo/use-demo-store';
import type { ContentItemDemo, WorkflowStatus } from '../../../../lib/demo/types';
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
import {
  IconCheck,
  IconChevronRight,
  IconEdit,
  IconEye,
  IconFileText,
  IconGlobe,
  IconRefreshCw,
  IconSave,
} from '../../../../components/icons';

export default function ContentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const store = useDemoStore();
  const id = typeof params.id === 'string' ? params.id : '';

  const item = store.getContentItemById(id);

  const [activeTab, setActiveTab] = useState<'ar' | 'en' | 'preview'>('ar');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [slug, setSlug] = useState('');
  const [summaryAr, setSummaryAr] = useState('');
  const [summaryEn, setSummaryEn] = useState('');
  const [bodyAr, setBodyAr] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<WorkflowStatus>('DRAFT');
  const [reviewNotes, setReviewNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (item) {
      setTitleAr(item.titleAr);
      setTitleEn(item.titleEn);
      setSlug(item.slug);
      setSummaryAr(item.summaryAr);
      setSummaryEn(item.summaryEn);
      setBodyAr(item.bodyAr);
      setBodyEn(item.bodyEn);
      setCategory(item.category);
      setStatus(item.status);
      setReviewNotes(item.reviewNotes || '');
    }
  }, [item]);

  if (!item) {
    return (
      <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
        <h2>المادة غير موجودة</h2>
        <p style={{ color: 'var(--color-text-muted)' }}>لم يتم العثور على المادة المطلوبة في مخزن المعاينة.</p>
        <Link href="/admin/content" style={{ textDecoration: 'none' }}>
          <Button variant="primary">العودة لإدارة المحتوى</Button>
        </Link>
      </div>
    );
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    store.saveContentItem({
      id: item.id,
      slug,
      type: item.type,
      status,
      titleAr,
      titleEn,
      summaryAr,
      summaryEn,
      bodyAr,
      bodyEn,
      category,
      author: item.author,
      publishedAt: item.publishedAt,
      tags: item.tags,
      reviewNotes,
    });
    setFeedbackMsg('تم حفظ التغييرات بنجاح في مخزن المعاينة');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleWorkflowTransition = (newStatus: WorkflowStatus, note?: string) => {
    store.updateContentStatus(item.id, newStatus, note || reviewNotes);
    setStatus(newStatus);
    setFeedbackMsg(`تم تحويل حالة المادة إلى: ${newStatus}`);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockEnd: '0.25rem' }}>
            <Link href="/admin/content" style={{ color: 'inherit' }}>إدارة المحتوى</Link>
            <IconChevronRight size={14} />
            <span>تحرير المادة: {item.id}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', margin: 0 }}>
              محرر المحتوى ثنائي اللغة
            </h1>
            <Badge
              variant={
                status === 'PUBLISHED' ? 'success' :
                status === 'IN_REVIEW' ? 'warning' :
                status === 'APPROVED' ? 'primary' : 'neutral'
              }
            >
              {status}
            </Badge>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="outline" size="sm" onClick={() => handleSave()}>
            <IconSave size={16} />
            <span>حفظ كمسودة</span>
          </Button>

          {status === 'DRAFT' && (
            <Button variant="primary" size="sm" onClick={() => handleWorkflowTransition('IN_REVIEW', 'تم إرسال المسودة للمراجعة')}>
              <IconCheck size={16} />
              <span>إرسال للمراجعة والاعتماد</span>
            </Button>
          )}

          {status === 'IN_REVIEW' && (
            <>
              <Button variant="secondary" size="sm" onClick={() => handleWorkflowTransition('APPROVED', 'موافقة أولية')}>
                <span>اعتماد (Approve)</span>
              </Button>
              <Button variant="accent" size="sm" onClick={() => handleWorkflowTransition('PUBLISHED', 'نشر نهائي')}>
                <span>نشر مباشر (Publish)</span>
              </Button>
            </>
          )}

          {status === 'APPROVED' && (
            <Button variant="accent" size="sm" onClick={() => handleWorkflowTransition('PUBLISHED')}>
              <span>نشر رسمي على الموقع (Publish Live)</span>
            </Button>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <Alert variant="success" onClose={() => setFeedbackMsg('')}>
          {feedbackMsg}
        </Alert>
      )}

      {/* Editor & Preview Tabs */}
      <div style={{ marginBlockEnd: 'var(--space-6)' }}>
        <Tabs
          tabs={[
            { id: 'ar', label: 'المحتوى العربي (Arabic Editor)' },
            { id: 'en', label: 'المحتوى الإنجليزي (English Editor)' },
            { id: 'preview', label: 'معاينة حية للمادة (Live Portal Preview)' },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'ar' | 'en' | 'preview')}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.7fr)', gap: 'var(--space-8)' }} className="md-grid-cols-1">
        {/* Main Content Pane */}
        <div>
          {activeTab === 'ar' && (
            <Card style={{ padding: 'var(--space-6)' }}>
              <FormField label="العنوان العربي الرئيسي">
                <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
              </FormField>

              <FormField label="الملخص التنفيذي (عربي)">
                <Textarea rows={3} value={summaryAr} onChange={(e) => setSummaryAr(e.target.value)} />
              </FormField>

              <FormField label="المحتوى الكامل للمادة (عربي)">
                <Textarea rows={14} value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} />
              </FormField>
            </Card>
          )}

          {activeTab === 'en' && (
            <Card style={{ padding: 'var(--space-6)' }} dir="ltr">
              <FormField label="Headline (English)">
                <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
              </FormField>

              <FormField label="Summary (English)">
                <Textarea rows={3} value={summaryEn} onChange={(e) => setSummaryEn(e.target.value)} />
              </FormField>

              <FormField label="Full Body Narrative (English)">
                <Textarea rows={14} value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} />
              </FormField>
            </Card>
          )}

          {activeTab === 'preview' && (
            <Card style={{ padding: 'var(--space-8)' }}>
              <Badge variant="primary" style={{ marginBlockEnd: 'var(--space-2)' }}>{category}</Badge>
              <h2 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-3)' }}>
                {titleAr}
              </h2>
              <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBlockEnd: 'var(--space-4)', fontWeight: 600 }}>
                {summaryAr}
              </div>
              <div style={{ lineHeight: 1.8, color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>
                {bodyAr}
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <Card>
            <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
              بيانات النشر والاعتماد
            </h3>

            <FormField label="حالة المادة الحالية">
              <Select value={status} onChange={(e) => handleWorkflowTransition(e.target.value as WorkflowStatus)}>
                <option value="DRAFT">مسودة (DRAFT)</option>
                <option value="IN_REVIEW">قيد المراجعة (IN_REVIEW)</option>
                <option value="APPROVED">معتمد (APPROVED)</option>
                <option value="PUBLISHED">منشور (PUBLISHED)</option>
              </Select>
            </FormField>

            <FormField label="المعرف الرابطي (Slug)">
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
            </FormField>

            <FormField label="التصنيف المؤسسي">
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </FormField>

            <FormField label="ملاحظات المراجعة والتدقيق" hint="تظهر للمحررين ومديري التحرير">
              <Textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="أضف ملاحظات المراجعة أو أسباب التعديل..."
              />
            </FormField>

            <div style={{ marginBlockStart: 'var(--space-4)' }}>
              <Button variant="primary" size="md" style={{ width: '100%' }} onClick={() => handleSave()}>
                <IconSave size={16} />
                <span>حفظ التعديلات في المعاينة</span>
              </Button>
            </div>
          </Card>

          <Card style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
            <h4 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
              رابط المعاينة العامة
            </h4>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockEnd: 'var(--space-3)' }}>
              يمكنك معاينة صفحة المادة على الواجهة العامة:
            </p>
            <Link href={`/ar/news/${slug}`} target="_blank" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-secondary)', textDecoration: 'underline' }}>
              فتح الصفحة العامة للمادة &rarr;
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
