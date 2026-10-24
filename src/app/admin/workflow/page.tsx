'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import type { WorkflowStatus } from '../../../lib/demo/types';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardTitle,
  EmptyState,
  FormField,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '../../../components/ui';
import { IconAlertTriangle, IconCheck, IconEdit, IconFileText, IconRefreshCw, IconX } from '../../../components/icons';

export default function AdminWorkflowPage() {
  const store = useDemoStore();
  const allContent = store.getContentItems();

  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [reviewNoteModalOpen, setReviewNoteModalOpen] = useState(false);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const pendingItems = allContent.filter((c) => c.status === 'IN_REVIEW');
  const displayItems = activeTab === 'pending' ? pendingItems : allContent;

  const handleApprove = (id: string) => {
    store.updateContentStatus(id, 'APPROVED', 'تمت مراجعة المادة واعتمادها للنشر.');
    setFeedbackMsg('تم اعتماد المادة بنجاح (جاهزة للنشر النهائي)');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handlePublish = (id: string) => {
    store.updateContentStatus(id, 'PUBLISHED', 'تم النشر رسمياً على البوابة العامة.');
    setFeedbackMsg('تم نشر المادة رسمياً على الموقع العام');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const openReturnModal = (id: string) => {
    setSelectedItemId(id);
    setRejectionNotes('يرجى مراجعة الصياغة وتدقيق الأرقام في الفقرة الثانية قبل إعادة الإرسال.');
    setReviewNoteModalOpen(true);
  };

  const handleConfirmReturn = () => {
    if (!selectedItemId) return;
    store.updateContentStatus(selectedItemId, 'DRAFT', rejectionNotes);
    setReviewNoteModalOpen(false);
    setSelectedItemId(null);
    setFeedbackMsg('تمت إعادة المادة إلى المسودة مع إرسال ملاحظات المراجعة للمحرر');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            طابور المراجعة والاعتماد التحريري (Editorial Review Queue)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            إدارة مسار التحقق وضمان الجودة التحريرية قبل النشر العام (محاكاة التدفق: مسودة &larr; مراجعة &larr; اعتماد &larr; نشر).
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <Alert variant="success" onClose={() => setFeedbackMsg('')}>
          {feedbackMsg}
        </Alert>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-6)' }}>
        <button
          onClick={() => setActiveTab('pending')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'pending' ? 'var(--color-brand-primary)' : 'var(--color-bg-elevated)',
            color: activeTab === 'pending' ? '#ffffff' : 'var(--color-text-secondary)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
          }}
        >
          <span>المواد المعلقة بانتظار المراجعة</span>
          <Badge variant={pendingItems.length > 0 ? 'warning' : 'neutral'} size="sm">
            {pendingItems.length}
          </Badge>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            backgroundColor: activeTab === 'all' ? 'var(--color-brand-primary)' : 'var(--color-bg-elevated)',
            color: activeTab === 'all' ? '#ffffff' : 'var(--color-text-secondary)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            cursor: 'pointer',
          }}
        >
          كافة المواد عبر كافة الحالات ({allContent.length})
        </button>
      </div>

      {displayItems.length === 0 ? (
        <EmptyState
          title="طابور المراجعة فارغ"
          description="لا توجد مواد معلقة بانتظار المراجعة في الوقت الحالي."
          icon={<IconCheck size={32} />}
          action={
            <Link href="/admin/content/new" style={{ textDecoration: 'none' }}>
              <Button variant="primary" size="sm">إضافة مادة وإرسالها للمراجعة</Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>المادة / العنوان</TableHeader>
              <TableHeader>المحرر / الكاتب</TableHeader>
              <TableHeader>الحالة الحالية</TableHeader>
              <TableHeader>ملاحظات المراجعة</TableHeader>
              <TableHeader>إجراءات الاعتماد والنشر</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell style={{ maxWidth: '320px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.2rem' }}>
                    {item.titleAr}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {item.slug} ({item.category})
                  </div>
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                  {item.author}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      item.status === 'PUBLISHED' ? 'success' :
                      item.status === 'IN_REVIEW' ? 'warning' :
                      item.status === 'APPROVED' ? 'primary' : 'neutral'
                    }
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', maxWidth: '240px' }}>
                  {item.reviewNotes || '—'}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Link href={`/admin/content/${item.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="outline" size="sm" title="معاينة وتحرير">
                        <IconEdit size={14} />
                        <span>فحص</span>
                      </Button>
                    </Link>

                    {item.status === 'IN_REVIEW' && (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleApprove(item.id)}
                          title="اعتماد المادة"
                        >
                          <IconCheck size={14} />
                          <span>اعتماد</span>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => openReturnModal(item.id)}
                          title="إعادة للمسودة مع ملاحظات"
                        >
                          <IconX size={14} />
                          <span>إرجاع</span>
                        </Button>
                      </>
                    )}

                    {item.status === 'APPROVED' && (
                      <Button
                        variant="accent"
                        size="sm"
                        onClick={() => handlePublish(item.id)}
                        title="نشر على الموقع"
                      >
                        <IconCheck size={14} />
                        <span>نشر رسمي</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Return to Draft with Notes Modal */}
      <Modal
        isOpen={reviewNoteModalOpen}
        onClose={() => setReviewNoteModalOpen(false)}
        title="إعادة المادة إلى المحرر (طلب تعديلات)"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setReviewNoteModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmReturn}>
              تأكيد الإرجاع للمسودة
            </Button>
          </>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-4)' }}>
          سيتم تحويل حالة المادة إلى <strong>مسودة (DRAFT)</strong> وإشعار المحرر بالملاحظات المسجلة أدناه:
        </p>

        <FormField label="ملاحظات المراجعة وأسباب الإرجاع" required>
          <Textarea
            rows={4}
            value={rejectionNotes}
            onChange={(e) => setRejectionNotes(e.target.value)}
          />
        </FormField>
      </Modal>
    </div>
  );
}
