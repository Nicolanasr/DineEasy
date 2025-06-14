import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface PageHeroProps {
  badge?: string
  title: string
  highlightedTitle?: string
  description: string
  primaryButtonText?: string
  primaryButtonIcon?: ReactNode
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonIcon?: ReactNode
  secondaryButtonHref?: string
  children?: ReactNode
}

export function PageHero({
  badge,
  title,
  highlightedTitle,
  description,
  primaryButtonText,
  primaryButtonIcon = <ArrowRight className="ml-2 w-5 h-5" />,
  primaryButtonHref,
  secondaryButtonText,
  secondaryButtonIcon,
  secondaryButtonHref,
  children
}: PageHeroProps) {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        {badge && (
          <Badge variant="secondary" className="mb-6 bg-orange-100 text-orange-800 border-orange-200">
            {badge}
          </Badge>
        )}
        
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
          {highlightedTitle && (
            <span className="text-orange-600 block">{highlightedTitle}</span>
          )}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {description}
        </p>

        {(primaryButtonText || secondaryButtonText) && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {primaryButtonText && (
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3" asChild>
                <Link href={primaryButtonHref || '#'}>
                  {primaryButtonText}
                  {primaryButtonIcon}
                </Link>
              </Button>
            )}
            {secondaryButtonText && (
              <Button size="lg" variant="outline" className="px-8 py-3" asChild>
                <Link href={secondaryButtonHref || '#'}>
                  {secondaryButtonText}
                  {secondaryButtonIcon}
                </Link>
              </Button>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  )
}