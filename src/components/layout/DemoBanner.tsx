'use client';

import React, { useState } from 'react';
import { demoStore } from '../../lib/demo/store';
import { IconAlertTriangle, IconRefreshCw } from '../icons';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface DemoBannerProps {
  locale?: 'ar' | 'en';
}

export function DemoBanner({ locale = 'ar' }: DemoBannerProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const isAr = locale === 'ar';

  const handleReset = () => {
    demoStore.resetToDefaults();
    setToastMsg(isAr ? 'تمت إعادة تعيين البيانات التجريبية بنجاح' : 'Demo data successfully reset to defaults');
    setShowConfirm(false);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <>
      <aside className="demo-banner-compact" aria-label="Demo Prototype Notice">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span className="demo-pill">
            <IconAlertTriangle size={13} aria-hidden="true" />
            <span>DEMO / وضع المعاينة</span>
          </span>
          <span style={{ color: '#cbd5e1', fontSize: '0.8125rem' }}>
            {isAr
              ? 'بيانات تجريبية غير معتمدة رسمياً — مخصصة للمراجعة المؤسسية فقط'
              : 'Unapproved sample data for institutional stakeholder review only'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowConfirm(true)}
            className="demo-reset-btn"
            title={isAr ? 'إعادة ضبط البيانات التجريبية' : 'Reset demo store records'}
            type="button"
          >
            <IconRefreshCw size={13} aria-hidden="true" />
            <span>{isAr ? 'إعادة ضبط البيانات' : 'Reset Data'}</span>
          </button>
        </div>
      </aside>

      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title={isAr ? 'تأكيد إعادة تعيين البيانات التجريبية' : 'Confirm Reset Demo Data'}
        maxWidth="440px"
        footer={
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', width: '100%' }}>
            <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>
              {isAr ? 'إلغاء' : 'Cancel'}
            </Button>
            <Button variant="danger" size="sm" onClick={handleReset}>
              {isAr ? 'نعم، أعد التعيين' : 'Yes, Reset'}
            </Button>
          </div>
        }
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBlockEnd: 0 }}>
          {isAr
            ? 'هل تريد بالتأكيد إعادة ضبط كافة المقالات والمستجدات والاستفسارات إلى حالتها النموذجية الأولى؟ سيتم مسح أي تعديلات محلية قمت بتجربتها.'
            : 'Are you sure you want to restore all demo articles, programs, inquiries, and users to their initial default state? All local test edits will be reset.'}
        </p>
      </Modal>

      {toastMsg && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: 'var(--space-6)',
            insetInlineStart: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-brand-primary)',
            color: '#ffffff',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: 10001,
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>✓</span>
          <span>{toastMsg}</span>
        </div>
      )}
    </>
  );
}
