import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SPPLPF | Peace, Protection and Law Foundation',
  description: 'Official institutional platform for the Peace, Protection and Law Foundation (SPPLPF)',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
