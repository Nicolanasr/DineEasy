import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    QrCode,
    ArrowRight,
    Search,
    BookOpen,
    Video,
    MessageCircle,
    Phone,
    Settings,
    Users,
    ShoppingCart,
    CreditCard,
    BarChart3,
    Bell,
    FileText,
    Headphones
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Help Center - DineEasy Support & Documentation',
    description: 'Find answers to your DineEasy questions. Browse our knowledge base, tutorials, FAQs, and contact support for restaurant ordering system help.',
    keywords: 'DineEasy help, restaurant software support, QR code ordering help, user guide, troubleshooting, customer support',
}

export default function HelpCenter() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <QrCode className="w-8 h-8 text-orange-600" />
                        <span className="text-2xl font-bold text-gray-900">DineEasy</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/features" className="text-gray-600 hover:text-orange-600 transition-colors">Features</Link>
                        <Link href="/pricing" className="text-gray-600 hover:text-orange-600 transition-colors">Pricing</Link>
                        <Link href="/demo" className="text-gray-600 hover:text-orange-600 transition-colors">Demo</Link>
                        <Link href="/about" className="text-gray-600 hover:text-orange-600 transition-colors">About</Link>
                        <Button variant="outline" asChild>
                            <Link href="/contact">Contact Sales</Link>
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 px-4">
                <div className="container mx-auto text-center max-w-4xl">
                    <Badge variant="secondary" className="mb-6 bg-orange-100 text-orange-800 border-orange-200">
                        🆘 Help Center
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        How Can We
                        <span className="text-orange-600 block">Help You Today?</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Find answers to your questions, learn how to use DineEasy features, or get in touch with our support team
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for help articles, guides, or features..."
                                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                            />
                            <Button className="absolute right-2 top-2 bg-orange-600 hover:bg-orange-700">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Button variant="outline" size="lg" className="p-6 h-auto flex-col gap-2">
                            <MessageCircle className="w-6 h-6 text-orange-600" />
                            <span>Live Chat</span>
                        </Button>
                        <Button variant="outline" size="lg" className="p-6 h-auto flex-col gap-2">
                            <Phone className="w-6 h-6 text-orange-600" />
                            <span>Call Support</span>
                        </Button>
                        <Button variant="outline" size="lg" className="p-6 h-auto flex-col gap-2">
                            <Video className="w-6 h-6 text-orange-600" />
                            <span>Video Tutorials</span>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Popular Topics */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Help Topics</h2>
                        <p className="text-xl text-gray-600">Find quick answers to common questions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Settings className="w-6 h-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-xl">Getting Started</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Learn how to set up your restaurant, create menus, and configure QR codes
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Account setup and configuration</li>
                                    <li>• Creating your first menu</li>
                                    <li>• Generating QR codes</li>
                                    <li>• Staff training basics</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    View Guides
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">Customer Experience</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Understand how customers interact with your DineEasy ordering system
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• How customers join sessions</li>
                                    <li>• Collaborative ordering features</li>
                                    <li>• Payment and checkout process</li>
                                    <li>• Troubleshooting customer issues</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    Learn More
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <ShoppingCart className="w-6 h-6 text-green-600" />
                                </div>
                                <CardTitle className="text-xl">Order Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Manage orders, track status, and handle special requests efficiently
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Processing incoming orders</li>
                                    <li>• Order status updates</li>
                                    <li>• Handling modifications</li>
                                    <li>• Kitchen integration</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    View Tutorials
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <CreditCard className="w-6 h-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-xl">Payments & Billing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Set up payment processing, manage transactions, and understand billing
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Payment gateway setup</li>
                                    <li>• Processing refunds</li>
                                    <li>• Understanding billing cycles</li>
                                    <li>• Payment troubleshooting</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    Payment Help
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                                    <BarChart3 className="w-6 h-6 text-yellow-600" />
                                </div>
                                <CardTitle className="text-xl">Analytics & Reports</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Access insights, generate reports, and track your restaurant{"'"}s performance
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Understanding your dashboard</li>
                                    <li>• Generating sales reports</li>
                                    <li>• Customer behavior insights</li>
                                    <li>• Performance optimization</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    Analytics Guide
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Bell className="w-6 h-6 text-red-600" />
                                </div>
                                <CardTitle className="text-xl">Troubleshooting</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Resolve common issues and learn how to handle technical problems
                                </p>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li>• Common error messages</li>
                                    <li>• Connection issues</li>
                                    <li>• QR code not working</li>
                                    <li>• Performance optimization</li>
                                </ul>
                                <Button variant="outline" className="w-full mt-4">
                                    Fix Issues
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Articles</h2>
                        <p className="text-xl text-gray-600">Step-by-step guides and best practices</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BookOpen className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">Complete Setup Guide for New Restaurants</h3>
                                        <p className="text-gray-600 mb-3">
                                            A comprehensive walkthrough to get your restaurant up and running with DineEasy in under an hour.
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>15 min read</span>
                                            <Badge variant="outline">Beginner</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Video className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">How to Train Your Staff on DineEasy</h3>
                                        <p className="text-gray-600 mb-3">
                                            Best practices and training materials to help your team get comfortable with the new system.
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>Video guide</span>
                                            <Badge variant="outline">Essential</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <BarChart3 className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">Maximizing Revenue with Analytics</h3>
                                        <p className="text-gray-600 mb-3">
                                            Learn how to use DineEasy{"'"}s analytics to identify opportunities and increase your average order value.
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>12 min read</span>
                                            <Badge variant="outline">Advanced</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Settings className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">Customizing Your Menu for Better UX</h3>
                                        <p className="text-gray-600 mb-3">
                                            Tips and tricks to organize your menu, add descriptions, and optimize for mobile ordering.
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>8 min read</span>
                                            <Badge variant="outline">Intermediate</Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg">
                            Browse All Articles
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Quick FAQ */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Quick Answers</h2>
                        <p className="text-xl text-gray-600">Common questions answered instantly</p>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-lg mb-2">How do customers access our menu?</h3>
                                <p className="text-gray-600">Customers simply scan the QR code at their table with their smartphone camera. No app download is required - they{"'"}ll be taken directly to your menu in their web browser.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-lg mb-2">What happens if a customer{"'"}s order fails?</h3>
                                <p className="text-gray-600">DineEasy automatically handles failed orders with retry mechanisms. If an order still fails, both the customer and restaurant staff are notified immediately, and our support team can assist with recovery.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-lg mb-2">Can we modify orders after they{"'"}re placed?</h3>
                                <p className="text-gray-600">Yes, restaurant staff can modify orders through the admin dashboard as long as they haven{"'"}t been marked as {"\""}in preparation{"\""} in the kitchen. Customers will be notified of any changes.</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-lg mb-2">How do we handle busy periods?</h3>
                                <p className="text-gray-600">DineEasy is designed to scale automatically. During peak times, the system prioritizes order processing and provides real-time kitchen load balancing to ensure smooth operations.</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-20 px-4 bg-orange-600">
                <div className="container mx-auto text-center max-w-4xl">
                    <div className="flex items-center justify-center mb-6">
                        <Headphones className="w-16 h-16 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Still Need Help?
                    </h2>
                    <p className="text-xl text-orange-100 mb-8">
                        Our support team is available 24/7 to help you with any questions or issues
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                        <Card className="bg-white/10 border-white/20">
                            <CardContent className="p-6 text-center">
                                <MessageCircle className="w-8 h-8 text-white mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Live Chat</h3>
                                <p className="text-orange-100 text-sm mb-4">Get instant help from our support team</p>
                                <Button variant="secondary" size="sm" className="w-full">
                                    Start Chat
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 border-white/20">
                            <CardContent className="p-6 text-center">
                                <Phone className="w-8 h-8 text-white mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Phone Support</h3>
                                <p className="text-orange-100 text-sm mb-4">Call us at +1 (555) 123-4568</p>
                                <Button variant="secondary" size="sm" className="w-full">
                                    Call Now
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 border-white/20">
                            <CardContent className="p-6 text-center">
                                <FileText className="w-8 h-8 text-white mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Submit Ticket</h3>
                                <p className="text-orange-100 text-sm mb-4">Send us a detailed support request</p>
                                <Button variant="secondary" size="sm" className="w-full">
                                    Create Ticket
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    <p className="text-orange-100 text-sm">
                        Average response time: Under 2 minutes for chat, 1 hour for tickets
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <QrCode className="w-8 h-8 text-orange-600" />
                                <span className="text-2xl font-bold">DineEasy</span>
                            </div>
                            <p className="text-gray-400">
                                Transforming restaurants with smart table ordering technology.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/demo" className="hover:text-white transition-colors">Demo</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Support</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                                <li><Link href="/training" className="hover:text-white transition-colors">Training</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 DineEasy. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}