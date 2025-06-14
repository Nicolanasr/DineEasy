import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageLayout, PageHero, SectionHeader } from '@/components/marketing'
import {
    ArrowRight,
    Calendar,
    Clock,
    User,
    TrendingUp,
    Users,
    Lightbulb,
    Target
} from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Blog - DineEasy Restaurant Technology Insights',
    description: 'Stay updated with the latest trends in restaurant technology, QR code ordering insights, industry best practices, and tips to grow your restaurant business.',
    keywords: 'restaurant blog, restaurant technology trends, QR code ordering tips, restaurant industry insights, dining trends',
}

export default function Blog() {
    return (
        <PageLayout activeLink="blog">
            <PageHero
                badge="📚 Industry Insights"
                title="Restaurant Technology"
                highlightedTitle="Insights & Trends"
                description="Stay ahead of the curve with expert insights, industry trends, and practical tips to grow your restaurant business"
                primaryButtonText="Subscribe to Newsletter"
                secondaryButtonText="Browse Categories"
            />

            {/* Featured Articles */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Featured Articles"
                        subtitle="Our most popular and impactful content"
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-48 rounded-t-lg"></div>
                            <CardHeader>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Dec 10, 2024</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>5 min read</span>
                                    </div>
                                </div>
                                <Badge className="w-fit mb-2 bg-orange-100 text-orange-800">Industry Trends</Badge>
                                <CardTitle className="text-2xl">The Future of Restaurant Ordering: QR Codes vs. Apps</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    Explore why QR code ordering is becoming the preferred choice over mobile apps for restaurants worldwide.
                                    We analyze customer preferences, implementation costs, and long-term benefits.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">By Sarah Chen</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Read More
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-48 rounded-t-lg"></div>
                            <CardHeader>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>Dec 8, 2024</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>7 min read</span>
                                    </div>
                                </div>
                                <Badge className="w-fit mb-2 bg-blue-100 text-blue-800">Case Study</Badge>
                                <CardTitle className="text-2xl">How Bistro Boulevard Increased Revenue by 30%</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">
                                    A detailed case study of how implementing DineEasy{"'"}s collaborative ordering system helped a local restaurant
                                    boost their average order value and customer satisfaction.
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-500">By Mike Johnson</span>
                                    </div>
                                    <Button variant="outline" size="sm">
                                        Read More
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Blog Categories */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Browse by Category"
                        subtitle="Find content that matters to your restaurant"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="w-8 h-8 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Industry Trends</h3>
                                <p className="text-gray-600 text-sm mb-4">Latest developments in restaurant technology and customer behavior</p>
                                <Button variant="outline" size="sm" className="w-full">
                                    12 Articles
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lightbulb className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Best Practices</h3>
                                <p className="text-gray-600 text-sm mb-4">Proven strategies to optimize your restaurant operations</p>
                                <Button variant="outline" size="sm" className="w-full">
                                    8 Articles
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Customer Experience</h3>
                                <p className="text-gray-600 text-sm mb-4">Tips to enhance dining experiences and customer satisfaction</p>
                                <Button variant="outline" size="sm" className="w-full">
                                    15 Articles
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow text-center">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="w-8 h-8 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Growth Strategies</h3>
                                <p className="text-gray-600 text-sm mb-4">Marketing and business development insights for restaurants</p>
                                <Button variant="outline" size="sm" className="w-full">
                                    10 Articles
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Recent Articles */}
            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <SectionHeader
                        title="Recent Articles"
                        subtitle="Stay up to date with our latest insights"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Article 1 */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-green-400 to-blue-400 h-32 rounded-t-lg"></div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Dec 5, 2024</span>
                                </div>
                                <Badge className="w-fit mb-2 bg-green-100 text-green-800">Technology</Badge>
                                <CardTitle className="text-lg">5 Ways QR Codes Are Revolutionizing Restaurant Service</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Discover how QR code technology is transforming the way restaurants serve customers and manage operations.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Read Article
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Article 2 */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-pink-400 to-red-400 h-32 rounded-t-lg"></div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Dec 3, 2024</span>
                                </div>
                                <Badge className="w-fit mb-2 bg-pink-100 text-pink-800">Customer Experience</Badge>
                                <CardTitle className="text-lg">Building Customer Loyalty in the Digital Age</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Learn effective strategies to build and maintain customer loyalty through digital experiences.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Read Article
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Article 3 */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-32 rounded-t-lg"></div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Dec 1, 2024</span>
                                </div>
                                <Badge className="w-fit mb-2 bg-yellow-100 text-yellow-800">Operations</Badge>
                                <CardTitle className="text-lg">Streamlining Restaurant Operations with Smart Technology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Practical tips to optimize your restaurant operations using modern technology solutions.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Read Article
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Article 4 */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 h-32 rounded-t-lg"></div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Nov 28, 2024</span>
                                </div>
                                <Badge className="w-fit mb-2 bg-indigo-100 text-indigo-800">Marketing</Badge>
                                <CardTitle className="text-lg">Social Media Strategies for Modern Restaurants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Effective social media marketing strategies to attract and engage restaurant customers.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Read Article
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Article 5 */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-32 rounded-t-lg"></div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Nov 25, 2024</span>
                                </div>
                                <Badge className="w-fit mb-2 bg-teal-100 text-teal-800">Finance</Badge>
                                <CardTitle className="text-lg">Understanding Restaurant Analytics and KPIs</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Key metrics every restaurant owner should track to improve profitability and performance.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Read Article
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Article 6 */}
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-gradient-to-r from-rose-400 to-pink-400 h-32 rounded-t-lg"></div>
                            <CardHeader className="pb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Nov 22, 2024</span>
                                </div>
                                <Badge className="w-fit mb-2 bg-rose-100 text-rose-800">Trends</Badge>
                                <CardTitle className="text-lg">2025 Restaurant Industry Predictions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 text-sm mb-4">
                                    Expert predictions on what to expect in the restaurant industry for the coming year.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                    Read Article
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Button variant="outline" size="lg">
                            View All Articles
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-20 px-4 bg-orange-600">
                <div className="container mx-auto text-center max-w-4xl">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Never Miss an Update
                    </h2>
                    <p className="text-xl text-orange-100 mb-8">
                        Subscribe to our newsletter for the latest restaurant industry insights and DineEasy updates
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900"
                        />
                        <Button size="lg" variant="secondary" className="px-8 py-3">
                            Subscribe
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                    <p className="text-orange-100 text-sm mt-4">
                        No spam, unsubscribe at any time
                    </p>
                </div>
            </section>
        </PageLayout>
    )
}