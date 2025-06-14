import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    QrCode,
    ArrowRight,
    Play,
    BookOpen,
    Users,
    Clock,
    CheckCircle,
    Star,
    Download,
    Video,
    FileText,
    Headphones,
    Award,
    Target,
    Zap
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Training & Resources - DineEasy Learning Center',
    description: 'Master DineEasy with our comprehensive training resources. Video tutorials, guides, webinars, and certification programs for restaurant teams.',
    keywords: 'DineEasy training, restaurant software training, QR code ordering tutorials, staff training, certification program',
}

export default function Training() {
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
                        <Link href="/training" className="text-orange-600 font-medium">Training</Link>
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
                        🎓 Training Center
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Master DineEasy
                        <span className="text-orange-600 block">With Expert Training</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Comprehensive training resources to help your team maximize the potential of your DineEasy system
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                            Start Learning
                            <Play className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 py-3">
                            Browse Resources
                            <BookOpen className="ml-2 w-5 h-5" />
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                            <div className="text-gray-600">Video Tutorials</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">1000+</div>
                            <div className="text-gray-600">Trained Staff</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
                            <div className="text-gray-600">Completion Rate</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Training Paths */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h2>
                        <p className="text-xl text-gray-600">Tailored training for different roles and experience levels</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="w-8 h-8 text-orange-600" />
                                </div>
                                <CardTitle className="text-xl">Restaurant Staff</CardTitle>
                                <p className="text-gray-600 mt-2">For servers, hosts, and front-of-house teams</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Customer interaction basics</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Handling QR code issues</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Order assistance</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Payment support</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>30 minutes • 5 modules</span>
                                    </div>
                                </div>
                                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                                    Start Training
                                    <Play className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <Target className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">Managers</CardTitle>
                                <p className="text-gray-600 mt-2">For restaurant managers and supervisors</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Dashboard overview</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Analytics and reporting</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Team management</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Performance optimization</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>45 minutes • 7 modules</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                                    Start Training
                                    <Play className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
                            <CardHeader className="text-center">
                                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Zap className="w-8 h-8 text-green-600" />
                                </div>
                                <CardTitle className="text-xl">Administrators</CardTitle>
                                <p className="text-gray-600 mt-2">For owners and system administrators</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">System configuration</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Menu management</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">User permissions</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-sm">Advanced features</span>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>60 minutes • 10 modules</span>
                                    </div>
                                </div>
                                <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                                    Start Training
                                    <Play className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Resource Types */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Training Resources</h2>
                        <p className="text-xl text-gray-600">Multiple formats to suit different learning preferences</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-none shadow-lg text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Video className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Video Tutorials</h3>
                                <p className="text-gray-600 text-sm mb-4">Step-by-step video guides covering all DineEasy features</p>
                                <Badge variant="outline" className="mb-4">50+ Videos</Badge>
                                <Button variant="outline" size="sm" className="w-full">
                                    Watch Now
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Documentation</h3>
                                <p className="text-gray-600 text-sm mb-4">Comprehensive guides and reference materials</p>
                                <Badge variant="outline" className="mb-4">100+ Pages</Badge>
                                <Button variant="outline" size="sm" className="w-full">
                                    Read Docs
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Headphones className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Live Webinars</h3>
                                <p className="text-gray-600 text-sm mb-4">Interactive sessions with DineEasy experts</p>
                                <Badge variant="outline" className="mb-4">Weekly</Badge>
                                <Button variant="outline" size="sm" className="w-full">
                                    Join Session
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Download className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Quick Guides</h3>
                                <p className="text-gray-600 text-sm mb-4">Printable cheat sheets and reference cards</p>
                                <Badge variant="outline" className="mb-4">PDF Downloads</Badge>
                                <Button variant="outline" size="sm" className="w-full">
                                    Download
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Training Modules</h2>
                        <p className="text-xl text-gray-600">Most accessed training content</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="border-none shadow-lg">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-32 rounded-t-lg relative">
                                <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className="bg-orange-100 text-orange-800">Beginner</Badge>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">15 min</span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">Getting Started with DineEasy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Complete introduction to DineEasy covering setup, basic navigation, and first order processing.
                                </p>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm">4.9 (234 reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">1,230 enrolled</span>
                                    </div>
                                </div>
                                <Button className="w-full">
                                    Start Course
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-32 rounded-t-lg relative">
                                <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className="bg-blue-100 text-blue-800">Intermediate</Badge>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">25 min</span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">Advanced Order Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Learn to handle complex orders, modifications, special requests, and busy period management.
                                </p>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm">4.8 (156 reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">892 enrolled</span>
                                    </div>
                                </div>
                                <Button className="w-full">
                                    Start Course
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <div className="bg-gradient-to-r from-green-500 to-teal-500 h-32 rounded-t-lg relative">
                                <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className="bg-green-100 text-green-800">Advanced</Badge>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">35 min</span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">Analytics & Performance Optimization</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Master DineEasy analytics to increase revenue, optimize operations, and improve customer satisfaction.
                                </p>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm">4.9 (89 reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">543 enrolled</span>
                                    </div>
                                </div>
                                <Button className="w-full">
                                    Start Course
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-32 rounded-t-lg relative">
                                <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                                    <Play className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className="bg-purple-100 text-purple-800">Expert</Badge>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">45 min</span>
                                    </div>
                                </div>
                                <CardTitle className="text-xl">Troubleshooting & Customer Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Handle technical issues, customer complaints, and system troubleshooting like a pro.
                                </p>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        <span className="text-sm">4.7 (67 reviews)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">321 enrolled</span>
                                    </div>
                                </div>
                                <Button className="w-full">
                                    Start Course
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Certification Program */}
            <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-amber-600">
                <div className="container mx-auto text-center max-w-4xl">
                    <div className="flex items-center justify-center mb-6">
                        <Award className="w-16 h-16 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-6">
                        DineEasy Certification Program
                    </h2>
                    <p className="text-xl text-orange-100 mb-8">
                        Become a certified DineEasy expert and boost your restaurant{"'"}s performance
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                        <Card className="bg-white/10 border-white/20">
                            <CardContent className="p-6 text-center">
                                <CheckCircle className="w-8 h-8 text-white mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Complete Training</h3>
                                <p className="text-orange-100 text-sm">
                                    Finish all required modules and pass assessments
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 border-white/20">
                            <CardContent className="p-6 text-center">
                                <Award className="w-8 h-8 text-white mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Get Certified</h3>
                                <p className="text-orange-100 text-sm">
                                    Receive official DineEasy certification badge
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 border-white/20">
                            <CardContent className="p-6 text-center">
                                <Star className="w-8 h-8 text-white mx-auto mb-3" />
                                <h3 className="text-white font-semibold mb-2">Unlock Benefits</h3>
                                <p className="text-orange-100 text-sm">
                                    Access exclusive features and priority support
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Button size="lg" variant="secondary" className="px-8 py-3">
                        Start Certification
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
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