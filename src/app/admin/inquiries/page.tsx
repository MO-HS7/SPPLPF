'use client';

import React, { useState } from 'react';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import type { InquiryDemo, InquiryStatus } from '../../../lib/demo/types';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  FormField,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '../../../components/ui';
import { IconCheck, IconEye, IconMail, IconPhone } from '../../../components/icons';

export default function AdminInquiriesPage() {
  const store = useDemoStore();
  const inquiries = store.getInquiries();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryDemo | null>(null);
  const [replyText, setReplyText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const filtered = inquiries.filter((inq) => {
    return statusFilter === 'ALL' || inq.status === statusFilter;
  });

  const handleUpdateStatus = (id: string, newStatus: InquiryStatus) => {
    store.updateInquiryStatus(id, newStatus);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
    setFeedbackMsg(`تم تحديث حالة الاستفسار إلى: ${newStatus}`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleSimulatedReply = () => {
    if (!selectedInquiry) return;
    store.updateInquiryStatus(selectedInquiry.id, 'RESPONDED', `تم الرد: ${replyText}`);
    setSelectedInquiry(null);
    setReplyText('');
    setFeedbackMsg('تم تسجيل الرد وإغلاق الاستفسار (محاكاة إشعار المستفيد)');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            صندوق الاستفسارات والعون القانوني (Inquiries Inbox)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            معاينة وإدارة طلبات العون القضائي والاستفسارات الواردة عبر بوابة التواصل العامة.
          </p>
        </div>

        <div style={{ width: '220px' }}>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">كافة الاستفسارات ({inquiries.length})</option>
            <option value="NEW">استفسارات جديدة (NEW)</option>
            <option value="IN_REVIEW">قيد المتابعة (IN_REVIEW)</option>
            <option value="RESPONDED">تم الرد (RESPONDED)</option>
          </Select>
        </div>
      </div>

      {feedbackMsg && (
        <Alert variant="success" onClose={() => setFeedbackMsg('')}>
          {feedbackMsg}
        </Alert>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          title="لا توجد استفسارات في هذا التصنيف"
          description="يمكنك تقديم استفسار جديد عبر بوابة التواصل لمعاينته هنا فوراً."
          icon={<IconMail size={32} />}
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>رقم الطلب / المرسل</TableHeader>
              <TableHeader>موضوع الاستفسار</TableHeader>
              <TableHeader>التصنيف</TableHeader>
              <TableHeader>التاريخ والوقت</TableHeader>
              <TableHeader>الحالة</TableHeader>
              <TableHeader>الإجراءات</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell style={{ maxWidth: '240px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                    {inq.fullName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    {inq.email}
                  </div>
                </TableCell>
                <TableCell style={{ maxWidth: '300px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    {inq.subject}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {inq.message}
                  </div>
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                  {inq.category}
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                  {inq.submittedAt}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inq.status === 'NEW' ? 'primary' :
                      inq.status === 'IN_REVIEW' ? 'warning' :
                      inq.status === 'RESPONDED' ? 'success' : 'neutral'
                    }
                    size="sm"
                  >
                    {inq.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(inq)}>
                    <IconEye size={14} />
                    <span>فحص والرد</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Inquiry Detail Inspection & Simulated Reply Modal */}
      {selectedInquiry && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedInquiry(null)}
          title={`استفسار مرجعي: ${selectedInquiry.id} — ${selectedInquiry.fullName}`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(null)}>
                إغلاق
              </Button>
              <Button variant="primary" size="sm" onClick={handleSimulatedReply}>
                إرسال الرد وحفظ الحالة
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
              <div><strong>المرسل:</strong> {selectedInquiry.fullName}</div>
              <div><strong>البريد:</strong> {selectedInquiry.email}</div>
              <div><strong>الهاتف:</strong> {selectedInquiry.phone}</div>
              <div><strong>التاريخ:</strong> {selectedInquiry.submittedAt}</div>
            </div>

            <div>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: '0.25rem' }}>
                الموضوع: {selectedInquiry.subject}
              </span>
              <div style={{ backgroundColor: 'var(--color-bg-canvas)', border: '1px solid var(--color-border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', lineHeight: 1.7, color: 'var(--color-text-secondary)', whiteSpace: 'pre-line' }}>
                {selectedInquiry.message}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>تحديث حالة الطلب:</span>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(selectedInquiry.id, 'IN_REVIEW')}>
                  قيد المتابعة
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleUpdateStatus(selectedInquiry.id, 'RESPONDED')}>
                  تم الرد
                </Button>
              </div>
            </div>

            <FormField label="صياغة الرد على المستفيد (محاكاة إشعار)">
              <Textarea
                rows={4}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب رد الفريق القانوني أو الإداري هنا..."
              />
            </FormField>
          </div>
        </Modal>
      )}
    </div>
  );
}
