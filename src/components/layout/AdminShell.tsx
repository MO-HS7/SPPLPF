'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { DirectionSync } from './DirectionSync';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/admin/overview';
  const isLoginPage = pathname === '/admin/login';

  return (
    <>
      <DirectionSync locale="ar" />
      {isLoginPage ? (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-canvas)' }}>
          <AdminSidebar />
          <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
            <AdminHeader />
            <main style={{ flex: '1 1 auto', padding: 'var(--space-8)' }}>
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
