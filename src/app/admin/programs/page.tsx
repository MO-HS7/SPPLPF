'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import type { ProgramDemo } from '../../../lib/demo/types';
import {
  Alert,
  Badge,
  Button,
  Card,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui';
import { IconCalendar, IconCheck, IconEdit, IconEye, IconPlus } from '../../../components/icons';

export default function AdminProgramsPage() {
  const store = useDemoStore();
  const programs = store.getPrograms();

  const [selectedProgram, setSelectedProgram] = useState<ProgramDemo | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            إدارة البرامج والمشاريع الميدانية (Programs)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            متابعة محاور التدخل، المشاريع النشطة، ونطاق العمليات في المحافظات.
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
            <TableHeader>اسم البرنامج</TableHeader>
            <TableHeader>المحور</TableHeader>
            <TableHeader>نطاق العمليات</TableHeader>
            <TableHeader>الحالة</TableHeader>
            <TableHeader>الإجراءات</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {programs.map((prog) => (
            <TableRow key={prog.id}>
              <TableCell style={{ maxWidth: '320px' }}>
                <div style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                  {prog.titleAr}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {prog.titleEn}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="primary" size="sm">{prog.pillar}</Badge>
              </TableCell>
              <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                {prog.location}
              </TableCell>
              <TableCell>
                <Badge variant="success" size="sm">{prog.status}</Badge>
              </TableCell>
              <TableCell>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <Button variant="outline" size="sm" onClick={() => setSelectedProgram(prog)}>
                    <IconEye size={14} />
                    <span>فحص البطاقة</span>
                  </Button>
                  <Link href={`/ar/programs/${prog.slug}`} target="_blank" style={{ textDecoration: 'none' }}>
                    <Button variant="ghost" size="sm">
                      الموقع العام &rarr;
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Program Inspection Modal */}
      {selectedProgram && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedProgram(null)}
          title={selectedProgram.titleAr}
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedProgram(null)}>
              إغلاق
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', fontSize: 'var(--text-sm)' }}>
            <div>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: '0.25rem' }}>
                الوصف التفصيلي:
              </span>
              <p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)', margin: 0 }}>
                {selectedProgram.descriptionAr}
              </p>
            </div>

            <div>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: '0.25rem' }}>
                الأهداف الاستراتيجية المحددة:
              </span>
              <ul style={{ paddingInlineStart: '1.25rem', listStyle: 'disc', color: 'var(--color-text-secondary)' }}>
                {selectedProgram.objectivesAr.map((obj, i) => (
                  <li key={i} style={{ marginBlockEnd: '0.25rem' }}>{obj}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-4)', backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
              <div><strong>الموقع:</strong> {selectedProgram.location}</div>
              <div><strong>المحور:</strong> {selectedProgram.pillar}</div>
              <div><strong>الحالة:</strong> {selectedProgram.status}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
