import { PageLayout, PageHero, SectionHeader, FeatureCard, CTASection } from '@/components/marketing'
import {
    QrCode,
    Users,
    ShoppingCart,
    Clock,
    Smartphone,
    Zap,
    Shield,
    BarChart3,
    Settings,
    Bell,
    CreditCard,
    Globe,
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Features - DineEasy Restaurant Ordering System',
    description: 'Explore DineEasy\'s comprehensive features: QR code ordering, collaborative dining, real-time updates, payment processing, analytics, and more.',
    keywords: 'restaurant features, QR code ordering, collaborative dining, restaurant analytics, payment processing, real-time updates',
}

export default function Features() {
    return (
        <PageLayout activeLink="features">
            <PageHero
                badge="🚀 Complete Feature Set"
                title="Everything Your Restaurant"
                highlightedTitle="Needs to Succeed"
                description="Discover how DineEasy's comprehensive feature set transforms every aspect of your restaurant's ordering process"
                primaryButtonText="Try Features Live"
                primaryButtonHref="/demo"
            />

            {/* Core Features */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Core Features"
                        subtitle="The foundation of modern restaurant ordering"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<QrCode className="w-6 h-6 text-orange-600" />}
                            title="QR Code Ordering"
                            description="Customers instantly access your menu by scanning a QR code at their table"
                            features={[
                                "Instant menu access",
                                "No app download required",
                                "Custom QR codes per table"
                            ]}
                        />

                        <FeatureCard
                            icon={<Users className="w-6 h-6 text-orange-600" />}
                            title="Collaborative Ordering"
                            description="Multiple people at the same table share a cart and order together"
                            features={[
                                "Real-time cart sharing",
                                "Individual order tracking",
                                "Group payment options"
                            ]}
                        />

                        <FeatureCard
                            icon={<ShoppingCart className="w-6 h-6 text-orange-600" />}
                            title="Smart Cart Management"
                            description="Advanced cart features with customizations and special instructions"
                            features={[
                                "Item customizations",
                                "Special instructions",
                                "Dietary preferences"
                            ]}
                        />

                        <FeatureCard
                            icon={<Clock className="w-6 h-6 text-orange-600" />}
                            title="Session Management"
                            description="Intelligent session handling based on restaurant type and activity"
                            features={[
                                "Auto session extension",
                                "Activity-based timing",
                                "Smart cleanup"
                            ]}
                        />

                        <FeatureCard
                            icon={<Smartphone className="w-6 h-6 text-orange-600" />}
                            title="Mobile-First Design"
                            description="Optimized for smartphones with intuitive touch interactions"
                            features={[
                                "Touch-optimized interface",
                                "Fast loading times",
                                "Offline capabilities"
                            ]}
                        />

                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-orange-600" />}
                            title="Real-Time Updates"
                            description="Live synchronization across all devices and order status updates"
                            features={[
                                "Live cart sync",
                                "Order status tracking",
                                "Kitchen notifications"
                            ]}
                        />
                    </div>
                </div>
            </section>

            {/* Advanced Features */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Advanced Features"
                        subtitle="Take your restaurant to the next level"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BarChart3 className="w-6 h-6 text-orange-600" />}
                            title="Analytics & Insights"
                            description="Comprehensive analytics to understand customer behavior and optimize operations"
                            features={[
                                "Order pattern analysis",
                                "Peak hours identification",
                                "Popular items tracking",
                                "Revenue optimization"
                            ]}
                        />

                        <FeatureCard
                            icon={<CreditCard className="w-6 h-6 text-orange-600" />}
                            title="Payment Processing"
                            description="Secure, fast payment processing with multiple payment options"
                            features={[
                                "Split payments",
                                "Multiple payment methods",
                                "Secure transactions",
                                "Automatic receipts"
                            ]}
                        />

                        <FeatureCard
                            icon={<Bell className="w-6 h-6 text-orange-600" />}
                            title="Service Requests"
                            description="Built-in service request system for seamless customer-staff communication"
                            features={[
                                "Call waiter button",
                                "Water refill requests",
                                "Check requests",
                                "Custom service needs"
                            ]}
                        />

                        <FeatureCard
                            icon={<Settings className="w-6 h-6 text-orange-600" />}
                            title="Menu Management"
                            description="Easy-to-use menu management with real-time updates and customizations"
                            features={[
                                "Real-time menu updates",
                                "Item availability control",
                                "Pricing adjustments",
                                "Seasonal menus"
                            ]}
                        />

                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-orange-600" />}
                            title="Security & Privacy"
                            description="Enterprise-grade security with data protection and privacy compliance"
                            features={[
                                "End-to-end encryption",
                                "GDPR compliance",
                                "Secure data storage",
                                "Regular security updates"
                            ]}
                        />

                        <FeatureCard
                            icon={<Globe className="w-6 h-6 text-orange-600" />}
                            title="Multi-Language Support"
                            description="Serve diverse customers with multi-language menu and interface support"
                            features={[
                                "Multiple language options",
                                "Currency localization",
                                "Cultural adaptations",
                                "Easy language switching"
                            ]}
                        />
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to Experience All Features?"
                description="See how DineEasy's complete feature set can transform your restaurant"
                primaryButtonText="Try Live Demo"
                primaryButtonHref="/demo"
                secondaryButtonText="Contact Sales"
                secondaryButtonHref="/contact"
            />
        </PageLayout>
    )
}