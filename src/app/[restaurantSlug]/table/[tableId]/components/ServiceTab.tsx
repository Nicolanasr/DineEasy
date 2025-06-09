// src/app/[restaurantSlug]/table/[tableId]/components/ServiceTab.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function ServiceTab() {
    return (
        <div className="grid gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Call for Service</CardTitle>
                    <CardDescription>
                        Get assistance from your server
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                    <Button variant="outline" className="justify-start gap-2">
                        🙋‍♂️ Call Waiter
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                        💧 Request Water Refill
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                        🧾 Request Check
                    </Button>
                    <Button variant="outline" className="justify-start gap-2">
                        ❓ Ask a Question
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-4">
                        <p className="text-muted-foreground">
                            No orders submitted yet
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}