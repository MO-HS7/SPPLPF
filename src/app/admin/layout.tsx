import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminShell } from '../../components/layout/AdminShell';

export const metadata: Metadata = {
  title: 'SPPLPF Admin Dashboard | لوحة التحكم المؤسسية',
  description: 'Administrative command center and editorial management workspace for SPPLPF',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
