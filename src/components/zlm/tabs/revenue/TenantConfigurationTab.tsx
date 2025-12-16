import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Globe, Calendar, DollarSign, FileText } from 'lucide-react';

export function TenantConfigurationTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Tenant Level Configuration</h2>
          <p className="text-muted-foreground">Configure global settings for revenue recognition</p>
        </div>
        <Button>Save Configuration</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">General Settings</CardTitle>
            </div>
            <CardDescription>Basic tenant configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Multi-Currency Support</Label>
                <p className="text-sm text-muted-foreground">Enable transactions in multiple currencies</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Automated Journal Entries</Label>
                <p className="text-sm text-muted-foreground">Auto-generate GL journal entries</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Real-time Recognition</Label>
                <p className="text-sm text-muted-foreground">Process revenue in real-time</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Accounting Period</CardTitle>
            </div>
            <CardDescription>Fiscal calendar settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-muted-foreground text-xs">Fiscal Year Start</Label>
                <p className="font-medium">January</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Period Type</Label>
                <p className="font-medium">Monthly</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Current Period</Label>
                <Badge variant="secondary">December 2024</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Period Status</Label>
                <Badge variant="default">Open</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Revenue Recognition Rules</CardTitle>
            </div>
            <CardDescription>ASC 606 compliance settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>SSP Validation</Label>
                <p className="text-sm text-muted-foreground">Enforce standalone selling price checks</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Variable Consideration</Label>
                <p className="text-sm text-muted-foreground">Enable variable consideration handling</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Contract Modifications</Label>
                <p className="text-sm text-muted-foreground">Track contract changes</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Audit & Compliance</CardTitle>
            </div>
            <CardDescription>Audit trail configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Full Audit Trail</Label>
                <p className="text-sm text-muted-foreground">Log all revenue transactions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>SOX Compliance Mode</Label>
                <p className="text-sm text-muted-foreground">Enhanced controls for SOX</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
