'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import {
  Alert,
  Badge,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui';
import { IconDownload, IconFileText, IconPlus } from '../../../components/icons';

export default function AdminPublicationsPage() {
  const store = useDemoStore();
  const pubs = store.getPublications();

  const [feedbackMsg, setFeedbackMsg] = useState('');

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            إدارة الإصدارات والتقارير (Publications)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            إدارة ملفات PDF، بيانات التحميل، والأوراق السياساتية المنشورة للجمهور.
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <Alert variant="success" onClose={() => setFeedbackMsg('')}>
          {feedbackMsg}
        </Alert>
      )}

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>عنوان الإصدار</TableHeader>
            <TableHeader>التصنيف</TableHeader>
            <TableHeader>تاريخ النشر</TableHeader>
            <TableHeader>حجم الملف / الصفحات</TableHeader>
            <TableHeader>مرات التحميل</TableHeader>
            <TableHeader>إجراءات</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {pubs.map((pub) => (
            <TableRow key={pub.id}>
              <TableCell style={{ maxWidth: '320px' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                  {pub.titleAr}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {pub.titleEn}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="primary" size="sm">{pub.category}</Badge>
              </TableCell>
              <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                {pub.publishedAt}
              </TableCell>
              <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                {pub.fileSize} ({pub.pages} صفحة)
              </TableCell>
              <TableCell style={{ fontSize: 'var(--text-xs)', fontWeight: 700 }}>
                {pub.downloadCount}
              </TableCell>
              <TableCell>
                <Link href={`/ar/publications`} target="_blank" style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="sm">
                    <IconDownload size={14} />
                    <span>معاينة وتنزيل</span>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
