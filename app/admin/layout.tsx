import { Metadata } from 'next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your Travel Hunter content',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="editor">
      <div className="flex h-screen bg-white dark:bg-slate-950">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
