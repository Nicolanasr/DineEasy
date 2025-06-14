import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { ReactNode } from 'react'

interface FeatureCardProps {
    icon: ReactNode
    title: string
    description: string
    features?: string[]
    buttonText?: string
    buttonHref?: string
    variant?: 'default' | 'highlighted'
    className?: string
}

export function FeatureCard({
    icon,
    title,
    description,
    features = [],
    buttonText,
    variant = 'default',
    className = ''
}: FeatureCardProps) {
    const cardClasses = variant === 'highlighted'
        ? 'border-2 border-orange-300 relative shadow-lg scale-105'
        : 'border-none shadow-lg hover:shadow-xl transition-shadow'

    return (
        <Card className={`${cardClasses} ${className}`}>
            {variant === 'highlighted' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                    </span>
                </div>
            )}
            <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 mb-4">{description}</p>

                {features.length > 0 && (
                    <ul className="space-y-2 text-sm text-gray-600 mb-4">
                        {features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {buttonText && (
                    <Button
                        variant={variant === 'highlighted' ? 'default' : 'outline'}
                        className={`w-full mt-4 ${variant === 'highlighted' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                    >
                        {buttonText}
                        <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}