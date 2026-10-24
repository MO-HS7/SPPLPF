'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Badge, Button, Card, FormField, Input } from '../../../components/ui';
import { IconGlobe, IconLock, IconScale, IconShield, IconUsers } from '../../../components/icons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@spplpf.org');
  const [password, setPassword] = useState('DemoSecurePass2026!');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('SUPER_ADMIN');

  const demoAccounts = [
    { email: 'admin@spplpf.org', name: 'مهند حسن', role: 'SUPER_ADMIN', label: 'مدير النظام (Super Admin)' },
    { email: 'content.mgr@spplpf.org', name: 'سارة عبدالكريم', role: 'CONTENT_MANAGER', label: 'مدير تحرير (Content Manager)' },
    { email: 'author@spplpf.org', name: 'حذيفة المهدي', role: 'CONTENT_AUTHOR', label: 'محرر محتوى (Content Author)' },
    { email: 'compliance@spplpf.org', name: 'مروان الشرجبي', role: 'AUDITOR', label: 'مدقق امتثال (Auditor)' },
  ];

  const handleQuickFill = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setSelectedRole(acc.role);
    setPassword('DemoPass2026!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/admin/overview');
    }, 500);
  };

  return (
    <div
      style={{
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        backgroundColor: 'var(--color-bg-canvas)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBlockEnd: 'var(--space-6)' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--color-brand-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginInline: 'auto',
              marginBlockEnd: 'var(--space-3)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <IconScale size={28} />
          </div>
          <h1 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            لوحة الإدارة والتحرير المؤسسي
          </h1>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            SPPLPF Administrative Command Workspace
          </span>
        </div>

        <Card style={{ padding: 'var(--space-8)' }}>
          <Alert variant="info" title="محاكاة بيئة المعاينة (Demo Simulation)">
            هذه الشاشة مخصصة لمعاينة واجهة الإدارة واختبار مسارات العمل. لا تُجري الواجهة مصادقة خلفية حقيقية، وسيتم ربط محرك التوثيق الفعلي لاحقاً في مهام التكامل.
          </Alert>

          <form onSubmit={handleSubmit} style={{ marginBlockStart: 'var(--space-4)' }}>
            <FormField label="البريد الإلكتروني المؤسسي" required>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@spplpf.org"
                required
              />
            </FormField>

            <FormField label="كلمة المرور" required>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </FormField>

            <div style={{ marginBlockStart: 'var(--space-6)' }}>
              <Button type="submit" variant="primary" style={{ width: '100%' }} isLoading={isLoading}>
                <IconLock size={16} />
                <span>دخول لوحة الإدارة (معاينة تجريبية)</span>
              </Button>
            </div>
          </form>

          {/* Quick-fill accounts */}
          <div style={{ marginBlockStart: 'var(--space-8)', borderBlockStart: '1px solid var(--color-border-subtle)', paddingBlockStart: 'var(--space-4)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBlockEnd: 'var(--space-2)' }}>
              حسابات تجريبية سريعة التعبئة:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)' }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  style={{
                    padding: '0.4rem 0.6rem',
                    fontSize: 'var(--text-xs)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-subtle)',
                    backgroundColor: email === acc.email ? 'var(--color-brand-primary-light)' : 'var(--color-bg-elevated)',
                    color: email === acc.email ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'start',
                    fontWeight: email === acc.email ? 700 : 500,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{acc.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginBlockStart: 'var(--space-6)' }}>
          <Link href="/ar" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <IconGlobe size={14} />
            <span>العودة إلى البوابة العامة للمؤسسة</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
