import { Header } from './Header'
import { Footer } from './Footer'
import { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  activeLink?: string
}

export function PageLayout({ children, activeLink }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Header activeLink={activeLink} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}