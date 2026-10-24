'use client';

import React from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import { Badge, Button, Card, CardContent, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui';
import {
  IconAlertTriangle,
  IconCalendar,
  IconCheck,
  IconEdit,
  IconFileText,
  IconMail,
  IconPlus,
  IconScale,
  IconShield,
  IconUsers,
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

  const recentEdits = content.slice(0, 4);

  return (
    <div>
      {/* Top Banner / Welcome */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-8)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            مركز القيادة والتحكم المؤسسي (Overview)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            مؤشرات المحتوى المباشرة، طابور المراجعة والاعتماد، وتحديثات سجل التدقيق الأمني (بيانات تجريبية تفاعلية).
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Link href="/admin/content/new" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="md">
              <IconPlus size={16} />
              <span>إضافة مادة جديدة</span>
            </Button>
          </Link>
          <Link href="/admin/workflow" style={{ textDecoration: 'none' }}>
            <Button variant="accent" size="md">
              <IconCheck size={16} />
              <span>طابور المراجعة ({inReviewCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', marginBlockEnd: 'var(--space-8)' }}>
        <Card style={{ borderBlockStart: '4px solid var(--color-brand-success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              المواد المنشورة
            </span>
            <Badge variant="success" size="sm">مكتمل</Badge>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlock: 'var(--space-2)' }}>
            {publishedCount}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            أخبار، قصص نجاح، وأنشطة منشورة
          </span>
        </Card>

        <Card style={{ borderBlockStart: '4px solid var(--color-brand-accent)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              قيد المراجعة والاعتماد
            </span>
            <Badge variant="warning" size="sm">مراجعة</Badge>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-brand-accent-hover)', marginBlock: 'var(--space-2)' }}>
            {inReviewCount}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            بانتظار موافقة مدير التحرير
          </span>
        </Card>

        <Card style={{ borderBlockStart: '4px solid var(--color-brand-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              مسودات قيد الإعداد
            </span>
            <Badge variant="neutral" size="sm">مسودة</Badge>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-brand-secondary)', marginBlock: 'var(--space-2)' }}>
            {draftsCount}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            مسودات عمل للمحررين
          </span>
        </Card>

        <Card style={{ borderBlockStart: '4px solid var(--color-brand-primary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 700 }}>
              استفسارات جديدة
            </span>
            <Badge variant="primary" size="sm">وارد</Badge>
          </div>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlock: 'var(--space-2)' }}>
            {newInquiriesCount}
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            طلبات عون واستشارات واردة
          </span>
        </Card>
      </div>

      {/* Main Grid: Recent Edits Table & Audit Log Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 0.8fr)', gap: 'var(--space-8)' }} className="md-grid-cols-1">
        {/* Recent Content Edits */}
        <div>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-4)' }}>
              <CardTitle style={{ margin: 0 }}>آخر المواد والتحريرات في المنصة</CardTitle>
              <Link href="/admin/content" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                كافة المواد &larr;
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
                      <div style={{ fontWeight: 600, color: 'var(--color-brand-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                    <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                      {item.updatedAt}
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/content/${item.id}`} style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
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
              <CardTitle style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <IconShield size={18} />
                <span>سجل التدقيق الأمني (Audit)</span>
              </CardTitle>
              <Link href="/admin/audit-logs" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                عرض السجل &larr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    backgroundColor: 'var(--color-bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                      {log.action}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem' }}>
                      {log.timestamp.split(' ')[1] || log.timestamp}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.75rem', lineHeight: 1.5 }}>
                    {log.details}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block', marginBlockStart: '0.2rem' }}>
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
