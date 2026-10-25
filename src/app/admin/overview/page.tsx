'use client';

import React from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import { Badge, Button, Card, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui';
import {
  IconCheck,
  IconCheckCircle,
  IconEdit,
  IconFileText,
  IconMail,
  IconPlus,
  IconShield,
  IconClock,
  IconArrowLeft,
  IconUsers,
  IconBarChart,
} from '../../../components/icons';

export default function AdminOverviewPage() {
  const store = useDemoStore();
  const content = store.getContentItems();
  const inquiries = store.getInquiries();
  const auditLogs = store.getAuditLogs().slice(0, 5);

  const publishedCount = content.filter((c) => c.status === 'PUBLISHED').length;
  const inReviewCount = content.filter((c) => c.status === 'IN_REVIEW').length;
  const draftsCount = content.filter((c) => c.status === 'DRAFT').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;

  const recentEdits = content.slice(0, 5);

  return (
    <div>
      {/* Top Header / Welcome */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBlockEnd: 'var(--space-8)',
          gap: 'var(--space-4)',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlockEnd: '0.25rem' }}>
            مركز القيادة والتحرير المؤسسي / Overview
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            مؤشرات المحتوى المباشرة، طابور المراجعة والاعتماد، وتحديثات سجل التدقيق الأمني (بيانات تجريبية تفاعلية).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <Link href="/admin/content/new" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md" icon={<IconPlus size={16} />}>
              <span>إضافة مادة جديدة</span>
            </Button>
          </Link>
          <Link href="/admin/workflow" style={{ textDecoration: 'none' }}>
            <Button variant="accent" size="md" icon={<IconCheckCircle size={16} />}>
              <span>طابور المراجعة ({inReviewCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards (Kiranism/shadcn High-Density Style) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBlockEnd: 'var(--space-8)',
        }}
      >
        {/* Metric 1 */}
        <Card hoverEffect style={{ borderTop: '3px solid var(--color-brand-success)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              المواد المنشورة
            </span>
            <span
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-brand-success-light)',
                color: 'var(--color-brand-success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconCheck size={16} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary)', lineHeight: 1.1 }}>
            {publishedCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
            أخبار، قصص نجاح، وتقارير عامة
          </div>
        </Card>

        {/* Metric 2 */}
        <Card hoverEffect style={{ borderTop: '3px solid var(--color-brand-accent)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              قيد المراجعة والاعتماد
            </span>
            <span
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-gold-100)',
                color: 'var(--color-brand-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconClock size={16} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-accent)', lineHeight: 1.1 }}>
            {inReviewCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
            بانتظار تدقيق مدير التحرير
          </div>
        </Card>

        {/* Metric 3 */}
        <Card hoverEffect style={{ borderTop: '3px solid var(--color-brand-secondary)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              مسودات قيد الإعداد
            </span>
            <span
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-brand-secondary-light)',
                color: 'var(--color-brand-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconEdit size={16} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-secondary)', lineHeight: 1.1 }}>
            {draftsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
            مسودات مسجلة للمحررين
          </div>
        </Card>

        {/* Metric 4 */}
        <Card hoverEffect style={{ borderTop: '3px solid var(--color-brand-primary)', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              استفسارات جديدة
            </span>
            <span
              style={{
                width: '2rem',
                height: '2rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-brand-primary-light)',
                color: 'var(--color-brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconMail size={16} />
            </span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary)', lineHeight: 1.1 }}>
            {newInquiriesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.4rem' }}>
            رسائل ومطالب وساطة واردة
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Edits Table & Audit Log Stream */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)',
          gap: '1.5rem',
        }}
        className="md-grid-cols-1"
      >
        {/* Recent Content Edits */}
        <div>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-4)' }}>
              <CardTitle style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                آخر المواد والتحريرات في المنصة
              </CardTitle>
              <Link
                href="/admin/content"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>كافة المواد</span>
                <IconArrowLeft size={14} />
              </Link>
            </div>

            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>العنوان / المادة</TableHeader>
                  <TableHeader>النوع</TableHeader>
                  <TableHeader>الحالة</TableHeader>
                  <TableHeader>التاريخ</TableHeader>
                  <TableHeader>إجراء</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentEdits.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-brand-primary)',
                          maxWidth: '260px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontSize: '0.875rem',
                        }}
                      >
                        {item.titleAr}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        {item.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="neutral" size="sm">{item.type}</Badge>
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
                    <TableCell style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {item.updatedAt}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/admin/content/${item.id}`}
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: 'var(--color-brand-secondary)',
                        }}
                      >
                        تحرير
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Audit Log Stream */}
        <div>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-4)' }}>
              <CardTitle style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '1rem', fontWeight: 700 }}>
                <IconShield size={18} style={{ color: 'var(--color-brand-primary)' }} />
                <span>سجل التدقيق الأمني (Audit)</span>
              </CardTitle>
              <Link
                href="/admin/audit-logs"
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: 'var(--color-brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}
              >
                <span>عرض السجل</span>
                <IconArrowLeft size={14} />
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    backgroundColor: 'var(--color-bg-subtle)',
                    border: '1px solid var(--color-border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 0.85rem',
                    fontSize: '0.8125rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)', fontSize: '0.8125rem' }}>
                      {log.action}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                      {log.timestamp.split(' ')[1] || log.timestamp}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {log.details}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                    بواسطة: {log.actor}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
