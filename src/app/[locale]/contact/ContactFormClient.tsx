'use client';

import React, { useState } from 'react';
import type { Locale } from '../../../lib/i18n';
import { demoStore } from '../../../lib/demo/store';
import { Alert, Button, FormField, Input, Select, Textarea } from '../../../components/ui';
import { IconCheck, IconMail, IconPhone, IconSend } from '../../../components/icons';

export interface ContactFormClientProps {
  locale: Locale;
}

export function ContactFormClient({ locale }: ContactFormClientProps) {
  const isAr = locale === 'ar';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(isAr ? 'عون قانوني واستشارة' : 'Legal Aid & Counseling');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiryId, setSubmittedInquiryId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot anti-spam
    if (honeypot) {
      console.warn('Spam submission detected by honeypot');
      return;
    }

    // Validation
    const newErrors: Record<string, string> = {};
    if (!fullName.trim()) {
      newErrors.fullName = isAr ? 'يرجى إدخال الاسم الكامل' : 'Full name is required';
    }
    if (!email.trim() || !email.includes('@')) {
      newErrors.email = isAr ? 'يرجى إدخال بريد إلكتروني صالح' : 'Valid email is required';
    }
    if (!subject.trim()) {
      newErrors.subject = isAr ? 'يرجى إدخال موضوع الرسالة' : 'Subject is required';
    }
    if (!message.trim() || message.trim().length < 10) {
      newErrors.message = isAr ? 'يرجى كتابة تفاصيل الرسالة (10 أحرف على الأقل)' : 'Message must be at least 10 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const created = demoStore.addInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || '—',
        subject: subject.trim(),
        category,
        message: message.trim(),
      });

      setIsSubmitting(false);
      setSubmittedInquiryId(created.id);
      // Reset form
      setFullName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        padding: 'var(--space-8)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-brand-primary)', marginBlockEnd: 'var(--space-2)' }}>
        {isAr ? 'نموذج التواصل والاستفسار القانوني' : 'Inquiry & Legal Aid Gateway'}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBlockEnd: 'var(--space-6)' }}>
        {isAr
          ? 'يسعدنا استقبال استفساراتكم وطلبات العون القضائي والتنسيق المؤسسي. سيقوم الفريق المختص بمتابعة طلبكم.'
          : 'We welcome your inquiries, legal aid requests, and institutional coordination communications.'}
      </p>

      {submittedInquiryId && (
        <Alert
          variant="success"
          title={isAr ? 'تم تسجيل رسالتكم بنجاح (محاكاة تجريبية)' : 'Inquiry Submitted Successfully (Prototype Demo)'}
          onClose={() => setSubmittedInquiryId(null)}
        >
          {isAr ? (
            <div>
              تم تسجيل استفساركم برقم مرجعي: <strong>{submittedInquiryId}</strong>.
              <br />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-success-hover)' }}>
                ملاحظة نموذجية: تم حفظ الرسالة في مخزن المعاينة، ويمكن لفريق العمل معاينتها فوراً في لوحة الإدارة ضمن صفحة "صندوق الاستفسارات".
              </span>
            </div>
          ) : (
            <div>
              Your inquiry has been logged under Reference ID: <strong>{submittedInquiryId}</strong>.
              <br />
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-brand-success-hover)' }}>
                Demo Note: Saved to local demo store. Administrators can inspect and process it in the Admin Dashboard under &quot;Public Inquiries&quot;.
              </span>
            </div>
          )}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Anti-spam Honeypot Field (hidden) */}
        <div style={{ display: 'none' }} aria-hidden="true">
          <input
            type="text"
            name="hp_phone_field"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          <FormField label={isAr ? 'الاسم الكامل' : 'Full Name'} required error={errors.fullName}>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={isAr ? 'الاسم الثلاثي أو اللقب' : 'Your full name'}
              error={!!errors.fullName}
            />
          </FormField>

          <FormField label={isAr ? 'البريد الإلكتروني' : 'Email Address'} required error={errors.email}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@domain.com"
              error={!!errors.email}
            />
          </FormField>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          <FormField label={isAr ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+967 ..."
            />
          </FormField>

          <FormField label={isAr ? 'طبيعة الاستفسار' : 'Inquiry Category'}>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value={isAr ? 'عون قانوني واستشارة' : 'Legal Aid & Counseling'}>
                {isAr ? 'طلب عون قضائي واستشارة قانونية' : 'Legal Aid & Counseling Request'}
              </option>
              <option value={isAr ? 'وساطة ومصالحة مجتمعية' : 'Community Mediation'}>
                {isAr ? 'وساطة ومصالحة مجتمعية' : 'Community Mediation'}
              </option>
              <option value={isAr ? 'تدريب وبناء قدرات' : 'Capacity Building'}>
                {isAr ? 'التدريب وبناء القدرات' : 'Training & Capacity Building'}
              </option>
              <option value={isAr ? 'شراكات وتنسيق مؤسسي' : 'Institutional Partnership'}>
                {isAr ? 'شراكات وتنسيق مؤسسي' : 'Partnership & Coordination'}
              </option>
              <option value={isAr ? 'استفسار عام' : 'General Inquiry'}>
                {isAr ? 'استفسار عام' : 'General Inquiry'}
              </option>
            </Select>
          </FormField>
        </div>

        <FormField label={isAr ? 'موضوع الرسالة' : 'Subject'} required error={errors.subject}>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={isAr ? 'عنوان موجز للاستفسار' : 'Brief subject summary'}
            error={!!errors.subject}
          />
        </FormField>

        <FormField label={isAr ? 'تفاصيل الرسالة أو الطلب' : 'Message Details'} required error={errors.message}>
          <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isAr ? 'اكتب تفاصيل الاستفسار أو القضية هنا...' : 'Provide details regarding your inquiry...'}
            error={!!errors.message}
          />
        </FormField>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBlockStart: 'var(--space-4)' }}>
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting}>
            <span>{isSubmitting ? (isAr ? 'جارٍ التسجيل...' : 'Submitting...') : (isAr ? 'إرسال الاستفسار' : 'Submit Inquiry')}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
