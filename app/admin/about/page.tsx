import { Suspense } from 'react'
import AdminAboutContent from './content'

export default function AdminAboutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">Loading...</div>}>
      <AdminAboutContent />
    </Suspense>
  )
}
