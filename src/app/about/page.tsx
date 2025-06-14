import { Card, CardContent } from '@/components/ui/card'
import { PageLayout } from '@/components/marketing/PageLayout'
import { PageHero } from '@/components/marketing/PageHero'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { StatsGrid } from '@/components/marketing/StatsGrid'
import { CTASection } from '@/components/marketing/CTASection'
import {
    Target,
    Heart,
    Users,
    Lightbulb,
    Award,
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About - DineEasy Restaurant Technology',
    description: 'Learn about DineEasy\'s mission to transform restaurant dining through innovative QR code ordering technology. Meet our team and discover our story.',
    keywords: 'about DineEasy, restaurant technology company, QR code ordering team, dining innovation',
}

export default function About() {
    const stats = [
        { value: '500+', label: 'Restaurants Served' },
        { value: '1M+', label: 'Orders Processed' },
        { value: '25+', label: 'Countries' },
        { value: '99.9%', label: 'Uptime' }
    ]

    return (
        <PageLayout activeLink="about">
            <PageHero
                badge="🚀 Our Story"
                title="Transforming Dining"
                highlightedTitle="One Table at a Time"
                description="We believe dining should be effortless, collaborative, and enjoyable. That's why we created DineEasy—to bridge the gap between technology and hospitality."
            />

            {/* Mission & Vision */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                                    <Target className="w-8 h-8 text-orange-600" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    To empower restaurants with technology that enhances both operational efficiency and customer experience,
                                    making dining more collaborative, accessible, and enjoyable for everyone.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-8">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                                    <Lightbulb className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    A world where every restaurant table becomes a smart, interactive hub that brings people together
                                    while streamlining operations and creating memorable dining experiences.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
                        <p className="text-xl text-gray-600">How DineEasy came to life</p>
                    </div>

                    <div className="space-y-12">
                        <div className="flex gap-8 items-start">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">2023</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-3">The Idea</h3>
                                <p className="text-gray-600 text-lg">
                                    Our founders, experienced restaurant operators and technology experts, noticed a gap in the market.
                                    While many solutions existed for ordering, none truly solved the collaborative dining experience
                                    that modern customers expect.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8 items-start">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">2024</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-3">Building the Solution</h3>
                                <p className="text-gray-600 text-lg">
                                    After months of research, customer interviews, and prototype testing in real restaurants,
                                    we developed DineEasy—a platform that truly understands both restaurant operations and customer needs.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-8 items-start">
                            <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">Now</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold mb-3">Growing Together</h3>
                                <p className="text-gray-600 text-lg">
                                    Today, DineEasy serves hundreds of restaurants worldwide, from small cafes to large chains,
                                    helping them create better dining experiences while improving operational efficiency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600">The principles that guide everything we do</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Customer-Centric</h3>
                            <p className="text-gray-600">
                                Every decision we make is guided by what{"'"}s best for restaurants and their customers.
                                We listen, learn, and iterate based on real feedback.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                            <p className="text-gray-600">
                                We believe the best experiences happen when people come together. Our platform
                                facilitates connection, not isolation.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Award className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                            <p className="text-gray-600">
                                We{"'"}re committed to delivering exceptional quality in everything we do, from our
                                technology to our customer support.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600">The people behind DineEasy</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-24 h-24 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-orange-700">AS</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Alex Smith</h3>
                                <p className="text-orange-600 mb-3">CEO & Co-Founder</p>
                                <p className="text-gray-600 text-sm">
                                    Former restaurant owner with 15 years of hospitality experience.
                                    Passionate about using technology to enhance human connections.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-blue-700">MJ</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Maria Johnson</h3>
                                <p className="text-blue-600 mb-3">CTO & Co-Founder</p>
                                <p className="text-gray-600 text-sm">
                                    Software architect with expertise in real-time systems and mobile technology.
                                    Previously led engineering teams at major tech companies.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-24 h-24 bg-green-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-green-700">DL</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">David Lee</h3>
                                <p className="text-green-600 mb-3">Head of Design</p>
                                <p className="text-gray-600 text-sm">
                                    UX designer specializing in hospitality technology.
                                    Believes great design should be invisible and intuitive.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader title="DineEasy by the Numbers" />
                    <StatsGrid stats={stats} columns={4} />
                </div>
            </section>

            <CTASection
                title="Ready to Join Our Mission?"
                description="Help us transform the restaurant industry, one table at a time"
                primaryButtonText="View Open Positions"
                primaryButtonHref="/careers"
                secondaryButtonText="Partner With Us"
                secondaryButtonHref="/contact"
            />
        </PageLayout>
    )
}