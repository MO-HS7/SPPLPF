'use client';

import React, { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  FormField,
  Input,
  Modal,
  Select,
} from '../../../components/ui';
import { IconAlertTriangle, IconCheck, IconLock, IconRefreshCw, IconSave, IconShield } from '../../../components/icons';
import { demoStore } from '../../../lib/demo/store';

export default function AdminSettingsPage() {
  const [orgNameAr, setOrgNameAr] = useState('مؤسسة تعزيز السلام والحماية القانونية');
  const [orgNameEn, setOrgNameEn] = useState('Peace, Protection and Law Foundation');
  const [contactEmail, setContactEmail] = useState('contact@spplpf.org');
  const [defaultLocale, setDefaultLocale] = useState('ar');
  const [takedownActive, setTakedownActive] = useState(false);
  const [maintenanceActive, setMaintenanceActive] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);


  const handleFieldChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    setHasUnsavedChanges(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHasUnsavedChanges(false);
    setFeedbackMsg('تم حفظ إعدادات النظام بنجاح في مخزن المعاينة');
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleResetDemo = () => {
    demoStore.resetToDefaults();
    setShowResetConfirm(false);
    setFeedbackMsg('تمت إعادة تعيين كافة البيانات التجريبية إلى حالتها الافتراضية بنجاح');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBlockEnd: 'var(--space-6)', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-1)' }}>
            إعدادات المنصة والنظام (Site Settings)
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', margin: 0 }}>
            ضبط المعلمات المؤسسية العامة، قنوات التنبيه، وإعدادات خطة الطوارئ (Emergency Takedown).
          </p>
        </div>

        {hasUnsavedChanges && (
          <Badge variant="warning" size="md">
            توجد تعديلات غير محفوظة
          </Badge>
        )}
      </div>

      {feedbackMsg && (
        <Alert variant="success" onClose={() => setFeedbackMsg('')}>
          {feedbackMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '850px' }}>
          {/* Section 1: Institutional Identity */}
          <Card>
            <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-4)' }}>
              الهوية والبيانات المؤسسية
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              <FormField label="اسم المؤسسة بالعربية">
                <Input
                  value={orgNameAr}
                  onChange={(e) => handleFieldChange(setOrgNameAr, e.target.value)}
                />
              </FormField>

              <FormField label="Institutional Name (English)">
                <Input
                  value={orgNameEn}
                  onChange={(e) => handleFieldChange(setOrgNameEn, e.target.value)}
                />
              </FormField>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
              <FormField label="البريد الإلكتروني المعتمد للاتصال">
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => handleFieldChange(setContactEmail, e.target.value)}
                />
              </FormField>

              <FormField label="اللغة الافتراضية للزوار الجدد">
                <Select
                  value={defaultLocale}
                  onChange={(e) => handleFieldChange(setDefaultLocale, e.target.value)}
                >
                  <option value="ar">العربية (RTL - افتراضي)</option>
                  <option value="en">English (LTR)</option>
                </Select>
              </FormField>
            </div>
          </Card>

          {/* Section 2: Security & Operational Guardrails */}
          <Card style={{ borderInlineStart: '4px solid var(--color-brand-danger)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-danger)', marginBlockEnd: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <IconAlertTriangle size={18} />
              <span>إجراءات الطوارئ والحماية الحساسة (Emergency Protocols)</span>
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockEnd: 'var(--space-4)' }}>
              آليات الإغلاق السريع وحجب المواد الحساسة في حالات الطوارئ الميدانية لحماية الكادر والمستفيدين (هدف استجابة أقل من 60 ثانية).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)' }}>
                    وضع الحجب السريع للطوارئ (Emergency Takedown Mode)
                  </strong>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                    تفعيل الحظر الفوري لكافة مسارات النشر وتفريغ التخزين المؤقت في حال ورود تهديد أمني.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange(setTakedownActive, !takedownActive)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: takedownActive ? 'var(--color-brand-danger)' : 'var(--color-border-strong)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                  }}
                >
                  {takedownActive ? 'المسار مفعل (نشط)' : 'معطل'}
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-4)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div>
                  <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-brand-primary)' }}>
                    وضع الصيانة المؤقتة (Maintenance Mode)
                  </strong>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                    عرض صفحة صيانة مخصصة للزوار مع الإبقاء على صلاحية وصول مديري النظام.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange(setMaintenanceActive, !maintenanceActive)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    backgroundColor: maintenanceActive ? 'var(--color-brand-accent)' : 'var(--color-border-strong)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: 'var(--text-xs)',
                    cursor: 'pointer',
                  }}
                >
                  {maintenanceActive ? 'مفعل (نشط)' : 'معطل'}
                </button>
              </div>
            </div>
          </Card>

          {/* Section 3: Demo Prototype Administration & Reset Tools */}
          <Card style={{ borderInlineStart: '4px solid var(--color-brand-accent)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <IconRefreshCw size={18} style={{ color: 'var(--color-brand-accent)' }} />
              <span>أدوات إدارة بيئة المعاينة التجريبية (Demo Prototype Management)</span>
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBlockEnd: 'var(--space-4)' }}>
              تتيح هذه الأداة إعادة تعيين كافة البيانات التجريبية (المقالات، البرامج، الاستفسارات، وسجلات التدقيق) إلى حالتها النموذجية الأولى لمراجعات أصحاب المصلحة.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-4)',
                backgroundColor: 'var(--color-bg-elevated)',
                borderRadius: 'var(--radius-md)',
                flexWrap: 'wrap',
                gap: 'var(--space-3)',
              }}
            >
              <div>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)', display: 'block' }}>
                  إعادة ضبط بيانات المعاينة إلى الحالة الافتراضية
                </strong>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  سيتم استرجاع السجلات الأصلية وحذف كافة التعديلات أو الاستفسارات التي تم إنشاؤها محلياً أثناء جلسة الاختبار.
                </span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowResetConfirm(true)}
                icon={<IconRefreshCw size={14} />}
              >
                <span>إعادة تعيين البيانات التجريبية</span>
              </Button>
            </div>
          </Card>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
            <Button type="submit" variant="primary" size="lg">
              <IconSave size={18} />
              <span>حفظ الإعدادات</span>
            </Button>
          </div>
        </div>
      </form>

      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="تأكيد إعادة تعيين البيانات التجريبية (Confirm Reset Demo Data)"
        maxWidth="460px"
        footer={
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="outline" size="sm" onClick={() => setShowResetConfirm(false)}>
              إلغاء
            </Button>
            <Button variant="danger" size="sm" onClick={handleResetDemo}>
              نعم، أعد التعيين
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBlockEnd: 0 }}>
          هل تريد بالتأكيد استعادة كافة البيانات النموذجية الافتراضية؟ سيتم مسح أي استفسارات أو مقالات تم حفظها محلياً أثناء جلسة التجربة الحالية.
        </p>
      </Modal>
    </div>
  );
}
