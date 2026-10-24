'use client';

import React, { useState } from 'react';
import { useDemoStore } from '../../../lib/demo/use-demo-store';
import type { RoleName, UserDemo } from '../../../lib/demo/types';
import {
  Alert,
  Badge,
  Button,
  Card,
  FormField,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui';
import { IconCheck, IconEdit, IconLock, IconScale, IconShield, IconUsers } from '../../../components/icons';

const ROLE_PERMISSIONS: Record<RoleName, { label: string; permissions: string[] }> = {
  SUPER_ADMIN: {
    label: 'مسؤول فائق (Super Admin)',
    permissions: [
      'users.manage',
      'roles.manage',
      'content.create',
      'content.edit',
      'content.review',
      'content.publish',
      'content.archive',
      'media.upload',
      'media.delete',
      'settings.manage',
      'audit.view',
      'inquiries.manage',
    ],
  },
  CONTENT_MANAGER: {
    label: 'مدير تحرير (Content Manager)',
    permissions: [
      'content.create',
      'content.edit',
      'content.review',
      'content.publish',
      'content.archive',
      'media.upload',
      'inquiries.manage',
    ],
  },
  CONTENT_AUTHOR: {
    label: 'محرر محتوى (Content Author)',
    permissions: ['content.create', 'content.edit', 'media.upload'],
  },
  AUDITOR: {
    label: 'مدقق امتثال وأمان (Auditor)',
    permissions: ['audit.view'],
  },
};

export default function AdminUsersPage() {
  const store = useDemoStore();
  const users = store.getUsers();

  const [selectedUser, setSelectedUser] = useState<UserDemo | null>(null);
  const [newRole, setNewRole] = useState<RoleName>('CONTENT_AUTHOR');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleOpenRoleModal = (u: UserDemo) => {
    setSelectedUser(u);
    setNewRole(u.role);
  };

  const handleSaveRole = () => {
    if (!selectedUser) return;
    store.updateUserRole(selectedUser.id, newRole);
    setSelectedUser(null);
    setFeedbackMsg(`تم تحديث دور المستخدم [${selectedUser.email}] إلى ${newRole} بنجاح.`);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleToggleActive = (id: string) => {
    store.toggleUserActive(id);
    setFeedbackMsg('تم تحديث حالة تفعيل الحساب.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            إدارة المستخدمين والصلاحيات (Users & RBAC)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            معاينة حسابات الفريق المؤسسي وإسناد الأدوار الأربعة المعتمدة وفق مصفوفة الصلاحيات الدقيقة (12 تصريحاً نظامياً).
          </p>
        </div>
      </div>

      {feedbackMsg && (
        <Alert variant="success" onClose={() => setFeedbackMsg('')}>
          {feedbackMsg}
        </Alert>
      )}

      {/* RBAC Reference Architecture Info */}
      <Card style={{ marginBlockEnd: 'var(--space-6)', backgroundColor: 'var(--color-bg-elevated)', borderInlineStart: '4px solid var(--color-brand-primary)' }}>
        <h3 style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <IconShield size={16} />
          <span>مصفوفة التحكم بالوصول المبني على الأدوار (RBAC Foundation)</span>
        </h3>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
          يعتمد النظام مبدأ المنع الافتراضي (Deny-by-Default) والربط العلائقي الدقيق عبر جداول PostgreSQL. يمتلك كل دور مجموعة محددة من الصلاحيات الإجرائية بدون أي استثناءات عشوائية أو تجاوزات صلبة في الكود.
        </p>
      </Card>

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>اسم المستخدم</TableHeader>
            <TableHeader>البريد الإلكتروني</TableHeader>
            <TableHeader>الدور الوظيفي (Role)</TableHeader>
            <TableHeader>عدد الصلاحيات</TableHeader>
            <TableHeader>حالة الحساب</TableHeader>
            <TableHeader>آخر تسجيل دخول</TableHeader>
            <TableHeader>الإجراءات</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((u) => {
            const roleInfo = ROLE_PERMISSIONS[u.role];
            return (
              <TableRow key={u.id}>
                <TableCell style={{ fontWeight: 700, color: 'var(--color-brand-primary)' }}>
                  {u.name}
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                  {u.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      u.role === 'SUPER_ADMIN' ? 'primary' :
                      u.role === 'CONTENT_MANAGER' ? 'secondary' :
                      u.role === 'AUDITOR' ? 'accent' : 'neutral'
                    }
                    size="sm"
                  >
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)', fontWeight: 600 }}>
                  {roleInfo.permissions.length} من 12
                </TableCell>
                <TableCell>
                  <Badge variant={u.isActive ? 'success' : 'danger'} size="sm">
                    {u.isActive ? 'نشط (Active)' : 'معطل (Locked)'}
                  </Badge>
                </TableCell>
                <TableCell style={{ fontSize: 'var(--text-xs)' }}>
                  {u.lastLoginAt}
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Button variant="outline" size="sm" onClick={() => handleOpenRoleModal(u)}>
                      <IconEdit size={14} />
                      <span>تعديل الدور</span>
                    </Button>
                    <Button
                      variant={u.isActive ? 'ghost' : 'secondary'}
                      size="sm"
                      onClick={() => handleToggleActive(u.id)}
                    >
                      {u.isActive ? 'تعطيل الحساب' : 'تفعيل'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Role Assignment Modal */}
      {selectedUser && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedUser(null)}
          title={`تعديل دور المستخدم: ${selectedUser.name}`}
          footer={
            <>
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                إلغاء
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveRole}>
                حفظ الدور الجديد
              </Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ backgroundColor: 'var(--color-bg-elevated)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
              <div><strong>المستخدم:</strong> {selectedUser.name} ({selectedUser.email})</div>
              <div><strong>الدور الحالي:</strong> {selectedUser.role}</div>
            </div>

            <FormField label="اختر الدور الجديد من الأدوار المعتمدة">
              <Select value={newRole} onChange={(e) => setNewRole(e.target.value as RoleName)}>
                <option value="SUPER_ADMIN">SUPER_ADMIN — مسؤول فائق (12 تصريحاً كاملاً)</option>
                <option value="CONTENT_MANAGER">CONTENT_MANAGER — مدير تحرير (7 تصاريح نشر واعتماد)</option>
                <option value="CONTENT_AUTHOR">CONTENT_AUTHOR — كاتب ومحرر (3 تصاريح مسودات)</option>
                <option value="AUDITOR">AUDITOR — مدقق امتثال (تصريح سجل التدقيق الأمني)</option>
              </Select>
            </FormField>

            <div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-brand-primary)', display: 'block', marginBlockEnd: 'var(--space-2)' }}>
                الصلاحيات الممنوحة للدور المحدد ({newRole}):
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                {ROLE_PERMISSIONS[newRole].permissions.map((perm) => (
                  <Badge key={perm} variant="neutral" size="sm">
                    {perm}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
