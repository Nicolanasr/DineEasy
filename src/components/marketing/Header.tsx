import { Button } from '@/components/ui/button'
import { QrCode } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  activeLink?: string
}

export function Header({ activeLink }: HeaderProps) {
  const isActive = (link: string) => activeLink === link

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <QrCode className="w-8 h-8 text-orange-600" />
          <span className="text-2xl font-bold text-gray-900">DineEasy</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/features" 
            className={`transition-colors ${
              isActive('features') 
                ? 'text-orange-600 font-medium' 
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Features
          </Link>
          <Link 
            href="/pricing" 
            className={`transition-colors ${
              isActive('pricing') 
                ? 'text-orange-600 font-medium' 
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Pricing
          </Link>
          <Link 
            href="/demo" 
            className={`transition-colors ${
              isActive('demo') 
                ? 'text-orange-600 font-medium' 
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Demo
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors ${
              isActive('about') 
                ? 'text-orange-600 font-medium' 
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            About
          </Link>
          <Link 
            href="/blog" 
            className={`transition-colors ${
              isActive('blog') 
                ? 'text-orange-600 font-medium' 
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Blog
          </Link>
          <Link 
            href="/careers" 
            className={`transition-colors ${
              isActive('careers') 
                ? 'text-orange-600 font-medium' 
                : 'text-gray-600 hover:text-orange-600'
            }`}
          >
            Careers
          </Link>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Sales</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}