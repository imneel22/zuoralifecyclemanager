import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShoppingCart, CreditCard, Users, Repeat, TrendingUp } from 'lucide-react';

export function HowTheySellTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">How They Sell</h2>
          <p className="text-muted-foreground">Configure sales motions and pricing models</p>
        </div>
        <Button>Save Configuration</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Sales Channels</CardTitle>
            </div>
            <CardDescription>Active selling channels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Direct Sales</p>
                  <p className="text-sm text-muted-foreground">Enterprise account managers</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Partner Channel</p>
                  <p className="text-sm text-muted-foreground">Reseller network</p>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Self-Service</p>
                  <p className="text-sm text-muted-foreground">Online purchasing</p>
                </div>
              </div>
              <Badge variant="secondary">Planned</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Pricing Models</CardTitle>
            </div>
            <CardDescription>Revenue pricing structures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Subscription Pricing</Label>
                <p className="text-sm text-muted-foreground">Recurring revenue model</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Usage-Based Pricing</Label>
                <p className="text-sm text-muted-foreground">Consumption metrics</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Tiered Pricing</Label>
                <p className="text-sm text-muted-foreground">Volume-based tiers</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Bundled Pricing</Label>
                <p className="text-sm text-muted-foreground">Multi-product bundles</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Contract Types</CardTitle>
            </div>
            <CardDescription>Supported contract structures</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span>Annual Contracts</span>
              <Badge>Primary</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span>Multi-Year Contracts</span>
              <Badge variant="outline">Supported</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span>Month-to-Month</span>
              <Badge variant="outline">Supported</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
              <span>Evergreen Contracts</span>
              <Badge variant="secondary">Planned</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Revenue Allocation</CardTitle>
            </div>
            <CardDescription>SSP and allocation rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Relative SSP Allocation</Label>
                <p className="text-sm text-muted-foreground">Allocate based on SSP ratios</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Residual Method</Label>
                <p className="text-sm text-muted-foreground">For observable vs estimated SSP</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Portfolio Approach</Label>
                <p className="text-sm text-muted-foreground">Group similar contracts</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
