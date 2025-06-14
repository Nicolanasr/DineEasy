import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageLayout, PageHero, SectionHeader, FeatureCard, StatsGrid, CTASection } from '@/components/marketing'
import {
    QrCode,
    Users,
    ShoppingCart,
    Clock,
    Smartphone,
    Star,
    CheckCircle,
    Zap,
    ArrowRight,
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'DineEasy - Transform Your Restaurant with Smart Table Ordering',
    description: 'QR code-powered collaborative dining experience. Customers scan, order together, and pay seamlessly. Boost efficiency, reduce wait times, and increase customer satisfaction.',
    keywords: 'restaurant ordering system, QR code menu, collaborative dining, table ordering, restaurant technology, contactless ordering, group ordering, dining experience',
    openGraph: {
        title: 'DineEasy - Smart Restaurant Table Ordering System',
        description: 'Transform your restaurant with QR code-powered collaborative ordering. Customers scan, order together, and enjoy a seamless dining experience.',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DineEasy - Smart Restaurant Ordering',
        description: 'QR code-powered collaborative dining. Scan, order together, enjoy seamlessly.',
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function Home() {
    const stats = [
        { value: '50%', label: 'Faster Order Processing' },
        { value: '30%', label: 'Increase in Order Value' },
        { value: '95%', label: 'Customer Satisfaction' }
    ]

    return (
        <PageLayout>
            <PageHero
                badge="🚀 Transform Your Restaurant Experience"
                title="Turn Every Table Into a"
                highlightedTitle="Smart Ordering Station"
                description="Let customers scan, browse, and order together seamlessly. Boost efficiency, reduce wait times, and create unforgettable dining experiences with our QR code-powered collaborative ordering system."
                primaryButtonText="Start Free Trial"
                secondaryButtonText="Watch Demo"
                secondaryButtonHref="/demo"
            >
                <StatsGrid stats={stats} />
            </PageHero>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader 
                        title="Everything You Need for Modern Dining"
                        subtitle="Powerful features that transform how customers order and how restaurants operate"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<QrCode className="w-6 h-6 text-orange-600" />}
                            title="QR Code Ordering"
                            description="Customers simply scan a QR code to instantly access your menu and start ordering"
                        />

                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-orange-600" />}
                            title="Collaborative Ordering"
                            description="Multiple people at the same table can add items to a shared cart in real-time"
                        />

                        <FeatureCard
                            icon={<ShoppingCart className="w-6 h-6 text-orange-600" />}
                            title="Smart Cart Management"
                            description="Track orders by participant, customize items, and add special instructions"
                        />

                        <FeatureCard
                            icon={<Clock className="w-6 h-6 text-orange-600" />}
                            title="Session Management"
                            description="Automatic session timers, extensions, and smart cleanup based on restaurant type"
                        />

                        <FeatureCard
                            icon={<Smartphone className="w-6 h-6 text-orange-600" />}
                            title="Mobile-First Design"
                            description="Optimized for smartphones with intuitive touch interactions and fast loading"
                        />

                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-orange-600" />}
                            title="Real-Time Updates"
                            description="Live synchronization across all devices with instant order status updates"
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader 
                        title="How DineEasy Works"
                        subtitle="Simple steps to revolutionize your restaurant's ordering process"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-orange-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Scan QR Code</h3>
                            <p className="text-gray-600">
                                Customers scan the QR code at their table to join the ordering session
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-orange-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Order Together</h3>
                            <p className="text-gray-600">
                                Browse the menu, customize items, and collaborate on the shared cart
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="text-2xl font-bold text-orange-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Submit & Enjoy</h3>
                            <p className="text-gray-600">
                                Submit the order to the kitchen and track status in real-time
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader 
                        title="Why Restaurants Choose DineEasy"
                        subtitle="Discover the benefits that make DineEasy the preferred choice for modern restaurants"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Reduce Staff Workload</h4>
                                    <p className="text-gray-600">Free up staff to focus on service and hospitality instead of taking orders</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Increase Order Accuracy</h4>
                                    <p className="text-gray-600">Eliminate miscommunication with direct digital ordering and customization</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Boost Table Turnover</h4>
                                    <p className="text-gray-600">Faster ordering and payment processing means more customers served</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-lg mb-2">Enhanced Customer Experience</h4>
                                    <p className="text-gray-600">Give customers control over their dining experience with collaborative ordering</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl p-8">
                            <div className="text-center">
                                <Star className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                                <blockquote className="text-lg text-gray-700 mb-4">
                                    "DineEasy transformed our restaurant. Order accuracy improved dramatically,
                                    and our staff can focus on creating amazing experiences instead of taking orders."
                                </blockquote>
                                <cite className="font-semibold">— Sarah Chen, Bistro Boulevard</cite>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to Transform Your Restaurant?"
                description="Join hundreds of restaurants already using DineEasy to create better dining experiences"
                primaryButtonText="Start Free Trial"
                secondaryButtonText="Schedule Demo"
                secondaryButtonHref="/demo"
            />
        </PageLayout>
    )
}