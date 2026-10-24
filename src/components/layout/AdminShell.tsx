'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { DemoBanner } from './DemoBanner';
import { DirectionSync } from './DirectionSync';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/admin/overview';
  const isLoginPage = pathname === '/admin/login';

  return (
    <>
      <DirectionSync locale="ar" />
      <DemoBanner locale="ar" />
      {isLoginPage ? (
        <main style={{ minHeight: 'calc(100vh - 2.5rem)', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      ) : (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 2.5rem)', backgroundColor: 'var(--color-bg-canvas)' }}>
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
