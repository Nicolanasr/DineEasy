import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout, PageHero, SectionHeader, CTASection } from '@/components/marketing'
import {
    Play,
    ArrowRight,
    Clock,
    Users,
    ShoppingCart,
    CheckCircle,
    Monitor,
    Smartphone,
    QrCode
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Demo - DineEasy Restaurant Ordering System',
    description: 'See DineEasy in action with our interactive demo. Experience QR code ordering, collaborative dining, and real-time cart management.',
    keywords: 'DineEasy demo, restaurant ordering demo, QR code ordering demo, interactive demo, live preview',
}

export default function Demo() {
    return (
        <PageLayout activeLink="demo">
            <PageHero
                badge="🎬 Interactive Demo"
                title="See DineEasy in Action"
                highlightedTitle="Experience the Future"
                description="Take a guided tour through DineEasy's features or try our interactive demo to experience the customer journey firsthand"
                primaryButtonText="Start Interactive Demo"
                primaryButtonIcon={<Play className="mr-2 w-5 h-5" />}
                secondaryButtonText="Schedule Live Demo"
                secondaryButtonHref="/contact"
            />

            {/* Demo Options */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Choose Your Demo Experience"
                        subtitle="Pick the demo format that works best for you"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <Smartphone className="w-8 h-8 text-orange-600" />
                                </div>
                                <CardTitle className="text-2xl">Interactive Demo</CardTitle>
                                <p className="text-gray-600 mt-2">Experience DineEasy as a customer would</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Scan QR code simulation</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Browse sample menu</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Add items to cart</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Try collaborative ordering</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Experience real-time updates</span>
                                    </li>
                                </ul>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>5 minutes • Available now</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                    <Play className="mr-2 w-4 h-4" />
                                    Try Interactive Demo
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-gray-200 hover:border-orange-300 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Monitor className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl">Live Demo Call</CardTitle>
                                <p className="text-gray-600 mt-2">Personalized walkthrough with our team</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Customized to your restaurant</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Ask questions in real-time</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>See admin dashboard</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Discuss pricing and setup</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span>Get implementation timeline</span>
                                    </li>
                                </ul>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>15-30 minutes • Schedule required</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/contact">Schedule Live Demo</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Demo Scenarios */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Demo Scenarios"
                        subtitle="Experience different restaurant scenarios"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-xl">🍕</span>
                                </div>
                                <CardTitle>Casual Dining</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Experience ordering at a busy family restaurant with multiple menu categories
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Large menu with categories</li>
                                    <li>• Family-style ordering</li>
                                    <li>• Dietary filters</li>
                                    <li>• Special instructions</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    Try Scenario
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-xl">☕</span>
                                </div>
                                <CardTitle>Coffee Shop</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Quick ordering experience perfect for cafes and coffee shops
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Simple menu layout</li>
                                    <li>• Customizable drinks</li>
                                    <li>• Quick checkout</li>
                                    <li>• Mobile optimization</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    Try Scenario
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-xl">🍽️</span>
                                </div>
                                <CardTitle>Fine Dining</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Elegant ordering experience for upscale restaurants
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Premium design theme</li>
                                    <li>• Detailed descriptions</li>
                                    <li>• Wine pairing suggestions</li>
                                    <li>• Course ordering</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    Try Scenario
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Features Demo */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="What You'll Experience"
                        subtitle="See these key features in action during the demo"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <QrCode className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">QR Code Scanning</h3>
                                    <p className="text-gray-600">See how customers instantly access your menu by scanning a QR code at their table</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Multi-User Collaboration</h3>
                                    <p className="text-gray-600">Experience how multiple people can add items to the same cart and see real-time updates</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ShoppingCart className="w-6 h-6 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">Smart Cart Management</h3>
                                    <p className="text-gray-600">See how easy it is to customize items, add special instructions, and manage orders</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8">
                            <h3 className="text-2xl font-bold mb-4">Ready to See It Live?</h3>
                            <p className="text-gray-700 mb-6">
                                Get a personalized demo tailored to your restaurant{"'"}s needs. Our team will show you exactly how DineEasy can transform your ordering process.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>No commitment required</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Ask all your questions</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>See custom features</span>
                                </div>
                            </div>
                            <Button className="w-full mt-6 bg-orange-600 hover:bg-orange-700" asChild>
                                <Link href="/contact">
                                    Schedule Personal Demo
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Demo Steps */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <SectionHeader
                        title="Demo Walkthrough"
                        subtitle="Here's what happens during your demo"
                    />

                    <div className="space-y-8">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Welcome & Introduction</h3>
                                <p className="text-gray-600">We{"'"}ll start with a brief overview of DineEasy and understand your restaurant{"'"}s specific needs.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">2</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Customer Experience</h3>
                                <p className="text-gray-600">Experience the customer journey from QR code scan to order completion, including collaborative features.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">3</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Restaurant Dashboard</h3>
                                <p className="text-gray-600">See the admin interface where you manage menus, view orders, and access analytics.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">4</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Q&A & Next Steps</h3>
                                <p className="text-gray-600">Ask questions, discuss pricing, and learn about implementation timelines and support.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to See DineEasy in Action?"
                description="Choose your demo experience and discover how DineEasy can transform your restaurant"
                primaryButtonText="Start Interactive Demo"
                primaryButtonIcon={<Play className="mr-2 w-5 h-5" />}
                secondaryButtonText="Schedule Live Demo"
                secondaryButtonHref="/contact"
            />
        </PageLayout>
    )
}