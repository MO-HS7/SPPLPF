import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../styles/globals.css';
import { ThemeProvider } from '../lib/theme/ThemeProvider';

export const metadata: Metadata = {
  title: {
    template: '%s | SPPLPF',
    default: 'SPPLPF | مؤسسة حماية القانون وتعزيز السلم الاجتماعي',
  },
  description: 'Official institutional platform for the Law Protection & Social Peace Foundation (SPPLPF - Provisional translation) - مؤسسة حماية القانون وتعزيز السلم الاجتماعي',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('spplpf-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

