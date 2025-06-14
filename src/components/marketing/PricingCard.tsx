import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { ReactNode } from 'react'

interface PricingCardProps {
  icon: ReactNode
  title: string
  description: string
  price: string | ReactNode
  period?: string
  subtext?: string
  features: string[]
  buttonText: string
  buttonHref?: string
  isPopular?: boolean
  buttonVariant?: 'default' | 'outline'
}

export function PricingCard({
  icon,
  title,
  description,
  price,
  period,
  subtext,
  features,
  buttonText,
  buttonHref = '#',
  isPopular = false,
  buttonVariant = 'outline'
}: PricingCardProps) {
  const cardClasses = isPopular 
    ? 'border-2 border-orange-300 relative shadow-lg scale-105'
    : 'border-2 border-gray-200 hover:border-orange-300 transition-colors'

  const buttonClasses = isPopular
    ? 'bg-orange-600 hover:bg-orange-700 text-white'
    : buttonVariant === 'outline' ? '' : 'bg-orange-600 hover:bg-orange-700 text-white'

  return (
    <Card className={cardClasses}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-orange-600 text-white px-4 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader className="text-center pb-8">
        <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <p className="text-gray-600 mt-2">{description}</p>
        <div className="mt-6">
          {typeof price === 'string' ? (
            <span className="text-4xl font-bold text-gray-900">{price}</span>
          ) : (
            price
          )}
          {period && <span className="text-gray-600">{period}</span>}
        </div>
        {subtext && <p className="text-sm text-gray-500 mt-2">{subtext}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-600" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button 
          className={`w-full mt-6 ${buttonClasses}`}
          variant={isPopular ? 'default' : buttonVariant}
          asChild
        >
          <Link href={buttonHref}>
            {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}