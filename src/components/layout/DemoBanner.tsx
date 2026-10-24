'use client';

import React, { useState } from 'react';
import { demoStore } from '../../lib/demo/store';
import { IconAlertTriangle, IconRefreshCw } from '../icons';

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
      <div className="demo-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <IconAlertTriangle size={18} />
          <span>
            {isAr
              ? 'DEMO / وضع المعاينة — بيانات تجريبية غير معتمدة رسمياً، مخصصة للاستعراض والتطوير المؤسسي فقط'
              : 'DEMO / Preview Mode — Unapproved sample data for institutional stakeholder review only'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button
            onClick={() => setShowConfirm(true)}
            title={isAr ? 'إعادة ضبط البيانات التجريبية' : 'Reset demo store records'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              textDecoration: 'none',
            }}
          >
            <IconRefreshCw size={14} />
            <span>{isAr ? 'إعادة تعيين البيانات' : 'Reset Data'}</span>
          </button>
        </div>
      </div>

      {showConfirm && (
        <div
          role="dialog"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            padding: 'var(--space-4)',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--color-bg-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-6)',
              maxWidth: '420px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <h4 style={{ color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
              {isAr ? 'تأكيد إعادة تعيين البيانات' : 'Confirm Reset Demo Data'}
            </h4>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBlockEnd: 'var(--space-6)' }}>
              {isAr
                ? 'هل تريد بالتأكيد إعادة ضبط كافة المقالات والمستجدات والاستفسارات إلى حالتها النموذجية الأولى؟'
                : 'Are you sure you want to restore all demo articles, programs, inquiries, and users to their initial default state?'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-strong)',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  background: 'var(--color-brand-danger)',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isAr ? 'نعم، أعد التعيين' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            bottom: 'var(--space-6)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--color-brand-primary)',
            color: '#ffffff',
            padding: 'var(--space-3) var(--space-6)',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10001,
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          {toastMsg}
        </div>
      )}
    </>
  );
}
