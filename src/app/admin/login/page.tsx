'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, Badge, Button, Card, FormField, Input } from '../../../components/ui';
import { IconGlobe, IconLock, IconScale, IconShield, IconUsers, IconCheckCircle } from '../../../components/icons';

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
    }, 400);
  };

  return (
    <div
      style={{
        flex: '1 1 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1.5rem, 4vw, 3rem)',
        backgroundColor: 'var(--color-bg-canvas)',
        minHeight: '80vh',
      }}
    >
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBlockEnd: 'var(--space-6)' }}>
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--color-navy-950) 0%, var(--color-navy-800) 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginInline: 'auto',
              marginBlockEnd: 'var(--space-3)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <IconScale size={26} />
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-brand-primary)', marginBlockEnd: '0.25rem' }}>
            لوحة الإدارة والتحرير المؤسسي
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            SPPLPF Administrative Command Workspace
          </span>
        </div>

        <Card style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)', boxShadow: 'var(--shadow-lg)' }}>
          <Alert variant="info" title="محاكاة بيئة المعاينة (Demo Simulation)">
            هذه الشاشة مخصصة لمعاينة واجهة الإدارة واختبار مسارات العمل. لا تُجري الواجهة مصادقة خلفية حقيقية، وسيتم ربط محرك التوثيق الفعلي لاحقاً في مهام التكامل.
          </Alert>

          <form onSubmit={handleSubmit} style={{ marginBlockStart: 'var(--space-6)' }}>
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
              <Button type="submit" variant="primary" size="lg" style={{ width: '100%' }} isLoading={isLoading} icon={<IconLock size={16} />}>
                <span>دخول لوحة الإدارة (معاينة تجريبية)</span>
              </Button>
            </div>
          </form>

          {/* Quick-fill accounts */}
          <div style={{ marginBlockStart: 'var(--space-6)', borderBlockStart: '1px solid var(--color-border-subtle)', paddingBlockStart: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBlockEnd: '0.5rem' }}>
              الحسابات التجريبية المتاحة للاختبار السريع:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  style={{
                    padding: '0.5rem 0.65rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: email === acc.email ? '1.5px solid var(--color-brand-primary)' : '1px solid var(--color-border-subtle)',
                    backgroundColor: email === acc.email ? 'var(--color-brand-primary-light)' : 'var(--color-bg-subtle)',
                    color: email === acc.email ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'start',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{acc.name}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ textAlign: 'center', marginBlockStart: 'var(--space-6)' }}>
          <Link
            href="/ar"
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 500,
            }}
          >
            <IconGlobe size={14} />
            <span>العودة إلى البوابة العامة للمؤسسة</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
