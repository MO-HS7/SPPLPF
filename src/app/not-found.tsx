import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-4xl)',
          fontWeight: 900,
          color: 'var(--color-brand-primary)',
          marginBlockEnd: 'var(--space-2)',
        }}
      >
        404
      </div>
      <h2 style={{ fontSize: 'var(--text-xl)', marginBlockEnd: 'var(--space-3)' }}>
        الصفحة غير موجودة / Page Not Found
      </h2>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '450px', marginBlockEnd: 'var(--space-6)' }}>
        نعتذر، لم نتمكن من العثور على الصفحة المطلوبة. يمكنك العودة إلى الصفحة الرئيسية.
        <br />
        We could not locate the requested page. You can return to the home portal.
      </p>
      <Link
        href="/ar"
        style={{
          display: 'inline-flex',
          padding: '0.625rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--color-brand-primary)',
          color: '#ffffff',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        العودة للرئيسية / Return Home
      </Link>
    </div>
  );
}
