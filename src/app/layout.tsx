import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s | SPPLPF',
    default: 'SPPLPF | مؤسسة تعزيز السلام والحماية القانونية',
  },
  description: 'Official institutional platform for the Peace, Protection and Law Foundation (SPPLPF) - مؤسسة تعزيز السلام والحماية القانونية',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
