'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import type { WorkflowStatus } from '../../../lib/demo/types';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Input,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui';
import { IconCheck, IconEdit, IconPlus, IconSearch, IconTrash } from '../../../components/icons';

export default function AdminContentPage() {
  const store = useDemoStore();
  const content = store.getContentItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const filtered = content.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.titleAr.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.slug.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q);

    return matchesStatus && matchesType && matchesSearch;
  });

  const handleQuickStatus = (id: string, newStatus: WorkflowStatus) => {
    store.updateContentStatus(id, newStatus);
    setFeedbackMsg(`تم تحديث حالة المادة إلى ${newStatus}`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div>
      {/* Header Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            إدارة المحتوى والتحرير (Content Management)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            إنشاء وتحرير المواد الإخبارية وقصص النجاح والتقارير الميدانية باللغتين العربية والإنجليزية.
          </p>
        </div>
        <div>
          <Link href="/admin/content/new" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              <IconPlus size={16} />
              <span>إضافة مادة جديدة</span>
            </Button>
          </Link>
        </div>
      </div>

      {feedbackMsg && (
        <div
          style={{
            backgroundColor: 'var(--color-brand-success-light)',
            color: 'var(--color-brand-success-hover)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-3) var(--space-4)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            marginBlockEnd: 'var(--space-6)',
          }}
        >
          {feedbackMsg}
        </div>
      )}

      {/* Filter Toolbar */}
      <Card style={{ marginBlockEnd: 'var(--space-6)', padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-3)', flex: '1 1 auto' }}>
            <div style={{ width: '260px' }}>
              <Input
                placeholder="ابحث بالعنوان أو الكلمات المفتاحية..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ width: '180px' }}>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="ALL">كافة الحالات (All Status)</option>
                <option value="DRAFT">مسودة (Draft)</option>
                <option value="IN_REVIEW">قيد المراجعة (In Review)</option>
                <option value="APPROVED">معتمد (Approved)</option>
                <option value="PUBLISHED">منشور (Published)</option>
              </Select>
            </div>

            <div style={{ width: '160px' }}>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="ALL">كافة الأنواع (All Types)</option>
                <option value="news">خبر / بيان (News)</option>
                <option value="activity">نشاط ميداني (Activity)</option>
                <option value="story">قصة أثر (Story)</option>
              </Select>
            </div>
          </div>

          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            إجمالي النتائج: {filtered.length} مادة
          </span>
        </div>
      </Card>

      {/* Content Table */}
      {filtered.length === 0 ? (
        <EmptyState
          title="لم يتم العثور على مواد مطابقة"
          description="جرّب تعديل معايير البحث أو تصفية الحالات"
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('ALL');
                setTypeFilter('ALL');
              }}
            >
              إعادة ضبط التصفية
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>العنوان العربي / الإنجليزي</TableHeader>
              <TableHeader>النوع</TableHeader>
              <TableHeader>التصنيف</TableHeader>
              <TableHeader>حالة النشر</TableHeader>
              <TableHeader>تاريخ التحديث</TableHeader>
              <TableHeader>الإجراءات المتاحة</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell style={{ maxWidth: '300px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-brand-primary)', marginBottom: '0.2rem' }}>
                    {item.titleAr}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.titleEn}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="neutral" size="sm">{item.type}</Badge>
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                  {item.category}
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
                <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                  {item.updatedAt}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Link href={`/admin/content/${item.id}`} style={{ textDecoration: 'none' }}>
                      <Button variant="outline" size="sm">
                        <IconEdit size={14} />
                        <span>تحرير</span>
                      </Button>
                    </Link>

                    {item.status !== 'PUBLISHED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleQuickStatus(item.id, 'PUBLISHED')}
                        title="نشر سريع"
                      >
                        <IconCheck size={14} />
                        <span>نشر</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
