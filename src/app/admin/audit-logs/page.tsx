'use client';

import React, { useState } from 'react';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import type { AuditLogDemo } from '../../../lib/demo/types';
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui';
import { IconEye, IconLock, IconShield } from '../../../components/icons';

export default function AdminAuditLogsPage() {
  const store = useDemoStore();
  const logs = store.getAuditLogs();

  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState<AuditLogDemo | null>(null);

  const filtered = logs.filter((log) => {
    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      log.actor.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.entity.toLowerCase().includes(q);

    return matchesAction && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            سجل التدقيق الأمني والعمليات (Audit Logs)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            سجل غير قابل للتعديل يوثق كافة العمليات الحساسة، تغيير الصلاحيات، وحركات نشر المحتوى.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card style={{ marginBlockEnd: 'var(--space-6)', padding: 'var(--space-4) var(--space-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: '1 1 auto' }}>
            <div style={{ width: '280px' }}>
              <Input
                placeholder="ابحث بالفاعل أو العملية أو التفاصيل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ width: '200px' }}>
              <Select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}>
                <option value="ALL">كافة الإجراءات (All Actions)</option>
                <option value="CONTENT_PUBLISH">نشر محتوى (CONTENT_PUBLISH)</option>
                <option value="WORKFLOW_SUBMIT">إرسال للمراجعة (WORKFLOW_SUBMIT)</option>
                <option value="WORKFLOW_TRANSITION">تغيير حالة (WORKFLOW_TRANSITION)</option>
                <option value="USER_ROLE_ASSIGN">إسناد أدوار (USER_ROLE_ASSIGN)</option>
                <option value="USER_ROLE_CHANGE">تعديل دور (USER_ROLE_CHANGE)</option>
                <option value="AUDIT_LOG_VIEW">استعلام سجل (AUDIT_LOG_VIEW)</option>
              </Select>
            </div>
          </div>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            إجمالي السجلات: {filtered.length} عملية
          </span>
        </div>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>معرف العملية</TableHeader>
            <TableHeader>الفاعل (Actor)</TableHeader>
            <TableHeader>نوع الإجراء (Action)</TableHeader>
            <TableHeader>الكيان المستهدف (Entity)</TableHeader>
            <TableHeader>الوقت والتاريخ</TableHeader>
            <TableHeader>التفاصيل</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {filtered.map((log) => (
            <TableRow key={log.id}>
              <TableCell style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>
                {log.id}
              </TableCell>
              <TableCell style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                {log.actor}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    log.action.includes('PUBLISH') ? 'success' :
                    log.action.includes('ROLE') ? 'danger' :
                    log.action.includes('SUBMIT') ? 'warning' : 'primary'
                  }
                  size="sm"
                >
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {log.entity}
              </TableCell>
              <TableCell style={{ fontSize: 'var(--text-xs)', whiteSpace: 'nowrap' }}>
                {log.timestamp}
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => setSelectedLog(log)}>
                  <IconEye size={14} />
                  <span>فحص السجل</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Audit Detail Modal */}
      {selectedLog && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLog(null)}
          title={`تفاصيل العملية: ${selectedLog.id}`}
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedLog(null)}>
              إغلاق
            </Button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
            <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
              <div><strong>نوع الإجراء:</strong> {selectedLog.action}</div>
              <div><strong>الوقت والتاريخ:</strong> {selectedLog.timestamp}</div>
              <div><strong>الفاعل:</strong> {selectedLog.actor}</div>
              <div><strong>الكيان:</strong> {selectedLog.entity}</div>
            </div>

            <div>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: '0.25rem' }}>
                بيان وتفاصيل العملية:
              </span>
              <p style={{ backgroundColor: 'var(--color-bg-canvas)', border: '1px solid var(--color-border-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                {selectedLog.details}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
