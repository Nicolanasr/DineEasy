import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    QrCode,
    ArrowRight,
    MapPin,
    Clock,
    DollarSign,
    Users,
    Zap,
    Heart,
    Trophy,
    Coffee,
    Laptop,
    Target
} from 'lucide-react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Careers - Join the DineEasy Team',
    description: 'Join DineEasy and help transform the restaurant industry. Explore open positions, company culture, benefits, and opportunities to make a real impact.',
    keywords: 'DineEasy careers, restaurant technology jobs, software engineer jobs, product manager jobs, startup careers',
}

export default function Careers() {
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
                        <Link href="/careers" className="text-orange-600 font-medium">Careers</Link>
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
                        🚀 Join Our Mission
                    </Badge>

                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Build the Future of
                        <span className="text-orange-600 block">Restaurant Technology</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Join a passionate team that{"'"}s transforming how millions of people dine. We{"'"}re looking for talented individuals who want to make a real impact.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3">
                            View Open Positions
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 py-3">
                            Learn About Our Culture
                        </Button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">50+</div>
                            <div className="text-gray-600">Team Members</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
                            <div className="text-gray-600">Countries</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-orange-600 mb-2">100%</div>
                            <div className="text-gray-600">Remote Friendly</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Join DineEasy?</h2>
                        <p className="text-xl text-gray-600">More than just a job—it{"'"}s an opportunity to shape the future</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Meaningful Impact</h3>
                                <p className="text-gray-600">
                                    Your work directly improves the dining experience for thousands of customers and helps restaurant owners succeed.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Cutting-Edge Technology</h3>
                                <p className="text-gray-600">
                                    Work with the latest technologies including React, TypeScript, real-time systems, and cloud infrastructure.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Collaborative Culture</h3>
                                <p className="text-gray-600">
                                    Join a supportive team that values collaboration, creativity, and continuous learning in a remote-first environment.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trophy className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Growth Opportunities</h3>
                                <p className="text-gray-600">
                                    Rapid career advancement in a fast-growing company with opportunities to lead projects and mentor others.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Laptop className="w-8 h-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Remote-First</h3>
                                <p className="text-gray-600">
                                    Work from anywhere with flexible hours, home office stipend, and regular team meetups around the world.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">Great Benefits</h3>
                                <p className="text-gray-600">
                                    Comprehensive health insurance, unlimited PTO, equity options, and professional development budget.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Open Positions</h2>
                        <p className="text-xl text-gray-600">Find your perfect role and help us grow</p>
                    </div>

                    <div className="space-y-6">
                        {/* Engineering Positions */}
                        <Card className="border-none shadow-lg">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Senior Full-Stack Engineer</CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>Remote</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Full-time</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>$120k - $160k</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-orange-100 text-orange-800">Engineering</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 mb-4">
                                    Lead the development of our core platform using React, TypeScript, Node.js, and PostgreSQL.
                                    You{"'"}ll work on real-time features, API design, and scaling our infrastructure.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">React</Badge>
                                        <Badge variant="outline">TypeScript</Badge>
                                        <Badge variant="outline">Node.js</Badge>
                                        <Badge variant="outline">PostgreSQL</Badge>
                                    </div>
                                    <Button variant="outline">Apply Now</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Mobile Developer (React Native)</CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>Remote</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Full-time</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>$100k - $140k</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-orange-100 text-orange-800">Engineering</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 mb-4">
                                    Build native mobile experiences for restaurant staff and management. Focus on performance,
                                    offline capabilities, and intuitive UX design.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">React Native</Badge>
                                        <Badge variant="outline">iOS</Badge>
                                        <Badge variant="outline">Android</Badge>
                                        <Badge variant="outline">Redux</Badge>
                                    </div>
                                    <Button variant="outline">Apply Now</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product & Design */}
                        <Card className="border-none shadow-lg">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Product Manager</CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>Remote / SF</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Full-time</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>$130k - $170k</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-800">Product</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 mb-4">
                                    Drive product strategy and roadmap for our core ordering platform. Work closely with engineering,
                                    design, and customers to build features that matter.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">Product Strategy</Badge>
                                        <Badge variant="outline">Analytics</Badge>
                                        <Badge variant="outline">User Research</Badge>
                                        <Badge variant="outline">B2B SaaS</Badge>
                                    </div>
                                    <Button variant="outline">Apply Now</Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">UX/UI Designer</CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>Remote</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Full-time</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>$90k - $130k</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-800">Design</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 mb-4">
                                    Design intuitive experiences for restaurant customers and staff. Focus on mobile-first design,
                                    accessibility, and creating delightful user journeys.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">Figma</Badge>
                                        <Badge variant="outline">UI/UX</Badge>
                                        <Badge variant="outline">Mobile Design</Badge>
                                        <Badge variant="outline">Prototyping</Badge>
                                    </div>
                                    <Button variant="outline">Apply Now</Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business & Sales */}
                        <Card className="border-none shadow-lg">
                            <CardHeader className="border-b">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">Customer Success Manager</CardTitle>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>Remote / NYC</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>Full-time</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <DollarSign className="w-4 h-4" />
                                                <span>$70k - $100k + equity</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">Customer Success</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-gray-600 mb-4">
                                    Help restaurants succeed with DineEasy. Onboard new customers, provide training,
                                    and ensure they achieve their goals using our platform.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">Customer Success</Badge>
                                        <Badge variant="outline">Training</Badge>
                                        <Badge variant="outline">SaaS</Badge>
                                        <Badge variant="outline">Communication</Badge>
                                    </div>
                                    <Button variant="outline">Apply Now</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-gray-600 mb-4">Don{"'"}t see the right role?</p>
                        <Button variant="outline" size="lg">
                            Send Us Your Resume
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
                        <p className="text-xl text-gray-600">We take care of our team</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Health & Wellness</h3>
                            <p className="text-gray-600 text-sm">
                                100% covered health, dental, and vision insurance. Mental health support and wellness stipend.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Laptop className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Equipment & Setup</h3>
                            <p className="text-gray-600 text-sm">
                                Latest MacBook, monitor, and $1,000 home office setup budget. Annual equipment refresh.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Coffee className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Flexible Time Off</h3>
                            <p className="text-gray-600 text-sm">
                                Unlimited PTO, flexible working hours, and generous parental leave policies.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <DollarSign className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Equity & Growth</h3>
                            <p className="text-gray-600 text-sm">
                                Competitive equity package and annual performance bonuses. Grow with the company.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trophy className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Learning & Development</h3>
                            <p className="text-gray-600 text-sm">
                                $2,000 annual learning budget, conference attendance, and internal mentorship programs.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Team Events</h3>
                            <p className="text-gray-600 text-sm">
                                Annual company retreats, quarterly team meetups, and virtual social events.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-orange-600">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Make an Impact?
                    </h2>
                    <p className="text-xl text-orange-100 mb-8">
                        Join us in transforming the restaurant industry and building something amazing together
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="px-8 py-3">
                            View All Positions
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 py-3 border-white text-white hover:bg-white hover:text-orange-600" asChild>
                            <Link href="/contact">Get in Touch</Link>
                        </Button>
                    </div>
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