import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface CTASectionProps {
  title: string
  description: string
  primaryButtonText?: string
  primaryButtonIcon?: ReactNode
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonIcon?: ReactNode
  secondaryButtonHref?: string
  backgroundColor?: 'orange' | 'gradient'
}

export function CTASection({
  title,
  description,
  primaryButtonText,
  primaryButtonIcon = <ArrowRight className="ml-2 w-5 h-5" />,
  primaryButtonHref = '#',
  secondaryButtonText,
  secondaryButtonIcon,
  secondaryButtonHref = '#',
  backgroundColor = 'orange'
}: CTASectionProps) {
  const bgClass = backgroundColor === 'gradient' 
    ? 'bg-gradient-to-r from-orange-600 to-amber-600'
    : 'bg-orange-600'

  return (
    <section className={`py-20 px-4 ${bgClass}`}>
      <div className="container mx-auto text-center max-w-4xl">
        <h2 className="text-4xl font-bold text-white mb-6">
          {title}
        </h2>
        <p className="text-xl text-orange-100 mb-8">
          {description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryButtonText && (
            <Button size="lg" variant="secondary" className="px-8 py-3" asChild>
              <Link href={primaryButtonHref}>
                {primaryButtonText}
                {primaryButtonIcon}
              </Link>
            </Button>
          )}
          {secondaryButtonText && (
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-orange-600" 
              asChild
            >
              <Link href={secondaryButtonHref}>
                {secondaryButtonText}
                {secondaryButtonIcon}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}