import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout } from '@/components/marketing/PageLayout'
import { PageHero } from '@/components/marketing/PageHero'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { CTASection } from '@/components/marketing/CTASection'
import {
    Check,
    Users,
    Building2,
    Zap
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Pricing - DineEasy Restaurant Ordering System',
    description: 'Simple, transparent pricing for DineEasy. Choose the perfect plan for your restaurant: Starter, Professional, or Enterprise. 14-day free trial.',
    keywords: 'restaurant pricing, QR code ordering pricing, restaurant software cost, table ordering system pricing',
}

export default function Pricing() {
    return (
        <PageLayout activeLink="pricing">
            <PageHero
                badge="💰 Transparent Pricing"
                title="Simple Pricing for"
                highlightedTitle="Every Restaurant"
                description="Choose the perfect plan for your restaurant. All plans include our core features with a 14-day free trial."
            >
                <div className="flex items-center justify-center gap-4 mb-8">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        ✓ 14-day free trial
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        ✓ No setup fees
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        ✓ Cancel anytime
                    </Badge>
                </div>
            </PageHero>

            {/* Pricing Cards */}
            <section className="py-20 px-4">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Starter Plan */}
                        <Card className="border-2 border-gray-200 hover:border-orange-300 transition-colors">
                            <CardHeader className="text-center pb-8">
                                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Starter</CardTitle>
                                <p className="text-gray-600 mt-2">Perfect for small cafes and bistros</p>
                                <div className="mt-6">
                                    <span className="text-4xl font-bold text-gray-900">$29</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Up to 10 tables</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>QR code ordering</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Collaborative ordering</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Basic menu management</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Order tracking</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Email support</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Basic analytics</span>
                                    </li>
                                </ul>
                                <Button className="w-full mt-6" variant="outline">
                                    Start Free Trial
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Professional Plan */}
                        <Card className="border-2 border-orange-300 relative shadow-lg scale-105">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <Badge className="bg-orange-600 text-white px-4 py-1">
                                    Most Popular
                                </Badge>
                            </div>
                            <CardHeader className="text-center pb-8">
                                <div className="mx-auto w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                                    <Building2 className="w-6 h-6 text-white" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Professional</CardTitle>
                                <p className="text-gray-600 mt-2">Ideal for full-service restaurants</p>
                                <div className="mt-6">
                                    <span className="text-4xl font-bold text-gray-900">$79</span>
                                    <span className="text-gray-600">/month</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Up to 50 tables</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Everything in Starter</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Advanced analytics</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Payment processing</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Service requests</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Multi-language support</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Priority support</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Custom branding</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>API access</span>
                                    </li>
                                </ul>
                                <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700">
                                    Start Free Trial
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Enterprise Plan */}
                        <Card className="border-2 border-gray-200 hover:border-orange-300 transition-colors">
                            <CardHeader className="text-center pb-8">
                                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                                <p className="text-gray-600 mt-2">For restaurant chains and large venues</p>
                                <div className="mt-6">
                                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Unlimited tables</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Everything in Professional</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Multi-location support</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Advanced integrations</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Custom features</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Dedicated support</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>SLA guarantee</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Check className="w-5 h-5 text-green-600" />
                                        <span>Training & onboarding</span>
                                    </li>
                                </ul>
                                <Button className="w-full mt-6" variant="outline" asChild>
                                    <Link href="/contact">Contact Sales</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Comparison */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Feature Comparison"
                        subtitle="See what's included in each plan"
                    />

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-6 font-semibold">Features</th>
                                    <th className="text-center py-4 px-6 font-semibold">Starter</th>
                                    <th className="text-center py-4 px-6 font-semibold">Professional</th>
                                    <th className="text-center py-4 px-6 font-semibold">Enterprise</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-6">QR Code Ordering</td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-6">Collaborative Ordering</td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-6">Tables Included</td>
                                    <td className="py-4 px-6 text-center">Up to 10</td>
                                    <td className="py-4 px-6 text-center">Up to 50</td>
                                    <td className="py-4 px-6 text-center">Unlimited</td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-6">Payment Processing</td>
                                    <td className="py-4 px-6 text-center">-</td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-6">Advanced Analytics</td>
                                    <td className="py-4 px-6 text-center">-</td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-6">Multi-location Support</td>
                                    <td className="py-4 px-6 text-center">-</td>
                                    <td className="py-4 px-6 text-center">-</td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                    <td className="py-4 px-6">Custom Integrations</td>
                                    <td className="py-4 px-6 text-center">-</td>
                                    <td className="py-4 px-6 text-center">-</td>
                                    <td className="py-4 px-6 text-center"><Check className="w-5 h-5 text-green-600 mx-auto" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <SectionHeader title="Frequently Asked Questions" />

                    <div className="space-y-8">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we{"'"}ll prorate the billing accordingly.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">What happens during the free trial?</h3>
                                <p className="text-gray-600">You get full access to all features of your chosen plan for 14 days. No credit card required to start. You can cancel anytime during the trial.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Are there any setup fees?</h3>
                                <p className="text-gray-600">No setup fees for any plan. We provide free onboarding and training to help you get started quickly.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                                <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans. Enterprise customers can arrange custom payment terms.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to Get Started?"
                description="Start your 14-day free trial today. No credit card required."
                primaryButtonText="Start Free Trial"
                secondaryButtonText="Talk to Sales"
                secondaryButtonHref="/contact"
            />
        </PageLayout>
    )
}