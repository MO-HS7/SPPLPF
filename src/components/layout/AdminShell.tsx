'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AdminHeader } from './AdminHeader';
import { AdminSidebar } from './AdminSidebar';
import { DirectionSync } from './DirectionSync';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/admin/overview';
  const isLoginPage = pathname === '/admin/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <DirectionSync locale="ar" />
      {isLoginPage ? (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          {children}
        </main>
      ) : (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-canvas)' }}>
          {/* Desktop Sidebar */}
          <div className="hidden-mobile" style={{ display: 'flex' }}>
            <AdminSidebar />
          </div>

          {/* Mobile Drawer Sidebar */}
          {mobileMenuOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Admin Navigation Drawer"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(6, 17, 33, 0.65)',
                backdropFilter: 'blur(3px)',
                zIndex: 1200,
                display: 'flex',
              }}
            >
              <div onClick={(e) => e.stopPropagation()} style={{ height: '100%', overflowY: 'auto' }}>
                <AdminSidebar onCloseMobile={() => setMobileMenuOpen(false)} />
              </div>
            </div>
          )}

          <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
            <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
            <main style={{ flex: '1 1 auto', padding: 'clamp(1rem, 2.5vw, 2rem)' }}>
              {children}
            </main>
          </div>
        </div>
      )}
    </>
  );
}
