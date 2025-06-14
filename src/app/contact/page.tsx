import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageLayout } from '@/components/marketing/PageLayout'
import { PageHero } from '@/components/marketing/PageHero'
import { SectionHeader } from '@/components/marketing/SectionHeader'
import { CTASection } from '@/components/marketing/CTASection'
import {
    ArrowRight,
    Mail,
    Phone,
    Clock,
    Calendar,
    Users,
    Headphones,
    Globe,
    Building
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Contact Us - DineEasy Sales & Support',
    description: 'Get in touch with DineEasy for sales inquiries, support, partnerships, or general questions. Schedule a demo or speak with our team today.',
    keywords: 'contact DineEasy, restaurant technology sales, customer support, demo request, partnership inquiries',
}

export default function Contact() {
    return (
        <PageLayout activeLink="contact">
            <PageHero
                badge="💬 Get in Touch"
                title="We're Here to Help"
                highlightedTitle="Your Restaurant Succeed"
                description="Whether you're ready to get started, have questions, or need support, our team is here to help you every step of the way."
                primaryButtonText="Schedule a Demo"
                primaryButtonIcon={<Calendar className="ml-2 w-5 h-5" />}
                secondaryButtonText="Call Sales Team"
                secondaryButtonIcon={<Phone className="ml-2 w-5 h-5" />}
            />

            {/* Contact Options */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="How Can We Help?"
                        subtitle="Choose the best way to reach us"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="w-8 h-8 text-orange-600" />
                                </div>
                                <CardTitle className="text-xl">Sales Inquiry</CardTitle>
                                <p className="text-gray-600 mt-2">Ready to get started with DineEasy?</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600 text-sm">
                                    Speak with our sales team to learn how DineEasy can transform your restaurant{"'"}s ordering process.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>+1 (555) 123-4567</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>sales@dineeasy.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>Mon-Fri, 9am-6pm PST</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                    Contact Sales
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Headphones className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">Customer Support</CardTitle>
                                <p className="text-gray-600 mt-2">Need help with your account?</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600 text-sm">
                                    Our support team is here to help with technical issues, training, and account management.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span>+1 (555) 123-4568</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>support@dineeasy.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>24/7 for customers</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                                    Get Support
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Building className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle className="text-xl">Partnerships</CardTitle>
                                <p className="text-gray-600 mt-2">Interested in partnering with us?</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-gray-600 text-sm">
                                    Explore partnership opportunities including integrations, reseller programs, and strategic alliances.
                                </p>
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span>partnerships@dineeasy.com</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        <span>Global opportunities</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>Response within 48hrs</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                                    Partner With Us
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <SectionHeader
                        title="Send Us a Message"
                        subtitle="We'll get back to you within 24 hours"
                    />

                    <Card className="border-none shadow-lg">
                        <CardContent className="p-8">
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Enter your first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Enter your last name"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Enter your phone number"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Restaurant Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            placeholder="Enter restaurant name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Inquiry Type *
                                        </label>
                                        <select
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        >
                                            <option value="">Select inquiry type</option>
                                            <option value="sales">Sales Inquiry</option>
                                            <option value="demo">Demo Request</option>
                                            <option value="support">Customer Support</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Tell us how we can help you..."
                                    ></textarea>
                                </div>

                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="newsletter"
                                        className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <label htmlFor="newsletter" className="text-sm text-gray-600">
                                        I{"'"}d like to receive updates about DineEasy features and restaurant industry insights
                                    </label>
                                </div>

                                <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                    Send Message
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <SectionHeader
                        title="Frequently Asked Questions"
                        subtitle="Quick answers to common questions"
                    />

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">How quickly can we get started with DineEasy?</h3>
                                <p className="text-gray-600">Most restaurants can be set up and running within 24-48 hours. Our team handles the initial setup and provides comprehensive training.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Do you offer a free trial?</h3>
                                <p className="text-gray-600">Yes! We offer a 14-day free trial with full access to all features. No credit card required to get started.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">What kind of support do you provide?</h3>
                                <p className="text-gray-600">We provide 24/7 customer support, comprehensive training materials, and dedicated account management for all customers.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-2">Can DineEasy integrate with our existing POS system?</h3>
                                <p className="text-gray-600">Yes, we integrate with most major POS systems. Our team will work with you to ensure seamless integration during setup.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg" asChild>
                            <Link href="/help">
                                Visit Help Center
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <CTASection
                title="Ready to Transform Your Restaurant?"
                description="Join thousands of restaurants already using DineEasy to create better dining experiences"
                primaryButtonText="Schedule a Demo"
                primaryButtonIcon={<Calendar className="ml-2 w-5 h-5" />}
                secondaryButtonText="Start Free Trial"
            />
        </PageLayout>
    )
}