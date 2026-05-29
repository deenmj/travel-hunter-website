import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Travel Hunter',
  description: 'Manage your Travel Hunter content',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
