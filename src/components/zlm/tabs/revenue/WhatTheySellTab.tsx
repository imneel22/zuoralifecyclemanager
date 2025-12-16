import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DollarSign, Grid3X3, BarChart3, Search, RefreshCw, ArrowLeft, Settings2 } from 'lucide-react';

const mockProductTypes = [
  { id: '1', name: 'Subscription including SaaS/Media/Franchise', charges: 109, high: 109, med: 0, low: 0 },
  { id: '2', name: 'One-Time Setup and On-Boarding', charges: 14, high: 5, med: 5, low: 4 },
  { id: '3', name: 'Software License (Termed) (Symbolic IP)', charges: 9, high: 9, med: 0, low: 0 },
  { id: '4', name: 'Prof services - Milestone', charges: 5, high: 1, med: 4, low: 0 },
  { id: '5', name: 'Termed Professional Services (Professional/Maintenance/Support Services)', charges: 4, high: 3, med: 1, low: 0 },
  { id: '6', name: 'Prof services - T&M', charges: 2, high: 2, med: 0, low: 0 },
  { id: '7', name: 'True Up Charges / Prepaid Drawdown / Minimum Commit', charges: 2, high: 0, med: 2, low: 0 },
  { id: '8', name: 'Single Outcome Based services (Audit, Assessment, Data Migration, Screening, Verification)', charges: 2, high: 1, med: 1, low: 0 },
];

const mockCharges = [
  { id: '2c92a0076a918739016a9dd87c837e81', product: 'Enterprise', ratePlan: 'Integration - Microsoft Dynamics', charge: 'Integration - Microsoft Dynamics', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring flat fee service...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start...' },
  { id: '2c92a0077bb618838178bdf8a7857bb8', product: 'Enterprise', ratePlan: 'License - Reporting Annual', charge: 'License - Reporting Annual', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'Recurring charge for reporting...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start. I' },
  { id: '2c92a0086ff0e97b016ffd70974c1887', product: 'Enterprise', ratePlan: 'Integrations - Video Feedback Question Type', charge: 'Integrations - Video Feedback Question Type', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring flat fee charge...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start...' },
  { id: '2c92a0087176f0dd01717a0997a75262', product: 'Enterprise', ratePlan: 'Integration - PowerBI', charge: 'Integration - PowerBI', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring charge with...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start...' },
  { id: '2c92a00f7b84b2df0178dc43bc838aae', product: 'Enterprise', ratePlan: 'Platform - Unlimited', charge: 'Platform - Unlimited', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring flat fee...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start...' },
  { id: '2c92a0117b84b2d60178dc3e854d426a', product: 'Enterprise', ratePlan: 'Platform - Silver', charge: 'Platform - Silver', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'Recurring subscription service with...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start. P' },
  { id: '2c92a0117b84b2d60178dc4239bf545c', product: 'Enterprise', ratePlan: 'Platform - Platinum', charge: 'Platform - Platinum', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'Recurring subscription service with...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start...' },
  { id: '2c92a0fc68282e4a01693c3acdbb73fc', product: 'Enterprise', ratePlan: 'Distribution - +100k Emails/Month', charge: 'Distribution - +100k Emails/Month', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring flat fee service...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start. T' },
  { id: '2c92a0fd6b8283d2791603c3abef82b18', product: 'Enterprise', ratePlan: 'License - Professional Annual', charge: 'License - Professional Annual', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring subscription...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start...' },
  { id: '2c92a0fd6b8283d2791603c3abf452b23', product: 'Enterprise', ratePlan: 'Integration - +600cpm API Limit', charge: 'Integration - +600cpm API Limit', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'Recurring flat service with in-advance...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Annual billing in advance, all term start. O' },
  { id: '2c92a0fd6b8283d2791603c3ac3272c12', product: 'Enterprise', ratePlan: 'License - Full Access Monthly', charge: 'License - Full Access Monthly', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring subscription...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Monthly recurring charge billed in advance. "Li' },
  { id: '2c92a0fd6b8283d2791603c3ac4c72c3d', product: 'Enterprise', ratePlan: 'License - Collaborator Monthly', charge: 'License - Collaborator Monthly', chargeType: 'Recurring', productType: 'Subscription includi...', revenueTiming: 'Upon Booking', amortization: 'Ratable', rationale: 'This is a recurring subscription...', confidence: 'High', ambiguityReason: '—', additionalConsiderations: 'Monthly recurring charge billed in advance. "Li' },
];

export function WhatTheySellTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProductType, setSelectedProductType] = useState<typeof mockProductTypes[0] | null>(null);
  const [confidenceFilter, setConfidenceFilter] = useState('all');

  const filteredProducts = mockProductTypes.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCharges = mockProductTypes.reduce((sum, p) => sum + p.charges, 0);
  const totalHigh = mockProductTypes.reduce((sum, p) => sum + p.high, 0);
  const totalMed = mockProductTypes.reduce((sum, p) => sum + p.med, 0);
  const totalLow = mockProductTypes.reduce((sum, p) => sum + p.low, 0);

  // Detail view for selected product type
  if (selectedProductType) {
    return (
      <div className="space-y-6">
        {/* Summary Cards - same as overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-primary/30 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Charges</p>
                  <div className="text-3xl font-bold mt-1">{totalCharges}</div>
                  <p className="text-sm text-primary mt-1">Revenue recognition items</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Types</p>
                  <div className="text-3xl font-bold mt-1">{mockProductTypes.length}</div>
                  <p className="text-sm text-primary mt-1">Unique categories identified</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Grid3X3 className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-300 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confidence Analysis</p>
                  <p className="text-xs text-orange-500 mt-1">AI classification confidence</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-center">
                      <span className="text-xl font-bold text-primary">{totalHigh}</span>
                      <p className="text-xs text-muted-foreground">High</p>
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold text-muted-foreground">{totalMed}</span>
                      <p className="text-xs text-muted-foreground">Medium</p>
                    </div>
                    <div className="text-center">
                      <span className="text-xl font-bold text-destructive">{totalLow}</span>
                      <p className="text-xs text-muted-foreground">Low</p>
                    </div>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detail Header */}
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            className="gap-2 -ml-2"
            onClick={() => setSelectedProductType(null)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Product Types
          </Button>

          <div>
            <h2 className="text-xl font-semibold">{selectedProductType.name}</h2>
            <p className="text-muted-foreground">{selectedProductType.charges} charges</p>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search charges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Confidence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Confidence</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Settings2 className="h-4 w-4" />
                Comfortable
              </Button>
            </div>
          </div>

          {/* Bulk Edit Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Select items to bulk edit</span>
            <Select>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Choose multiple rows and chan..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product-type">Change Product Type</SelectItem>
                <SelectItem value="revenue-timing">Change Revenue Timing</SelectItem>
                <SelectItem value="amortization">Change Amortization</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">Apply Change</Button>
          </div>
        </div>

        {/* Charges Table */}
        <div className="border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px]">CHARGE ID</TableHead>
                <TableHead>PRODUCT</TableHead>
                <TableHead>RATE PLAN</TableHead>
                <TableHead>CHARGE</TableHead>
                <TableHead>CHARGE TYPE</TableHead>
                <TableHead className="w-[50px]">
                  <Checkbox />
                </TableHead>
                <TableHead>PRODUCT TYPE</TableHead>
                <TableHead>REVENUE TIMING</TableHead>
                <TableHead>AMORTIZATION</TableHead>
                <TableHead>RATIONALE</TableHead>
                <TableHead>CONFIDENCE</TableHead>
                <TableHead>AMBIGUITY REASON</TableHead>
                <TableHead>ADDITIONAL CONSIDERATIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCharges.map((charge) => (
                <TableRow key={charge.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">{charge.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      {charge.product}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{charge.ratePlan}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{charge.charge}</TableCell>
                  <TableCell>{charge.chargeType}</TableCell>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{charge.productType}</TableCell>
                  <TableCell>
                    <span className="text-xs">Upon<br/>Booking</span>
                  </TableCell>
                  <TableCell>{charge.amortization}</TableCell>
                  <TableCell className="max-w-[150px] text-sm text-muted-foreground truncate">
                    {charge.rationale}
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      charge.confidence === 'High' 
                        ? 'bg-green-500 hover:bg-green-500' 
                        : charge.confidence === 'Medium' 
                        ? 'bg-amber-500 hover:bg-amber-500' 
                        : 'bg-destructive'
                    }>
                      {charge.confidence}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{charge.ambiguityReason}</TableCell>
                  <TableCell className="max-w-[180px] text-sm text-muted-foreground truncate">
                    {charge.additionalConsiderations}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Overview with product type cards
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/30 border-2">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Charges</p>
                <div className="text-3xl font-bold mt-1">{totalCharges}</div>
                <p className="text-sm text-primary mt-1">Revenue recognition items</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/30 border-2">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Product Types</p>
                <div className="text-3xl font-bold mt-1">{mockProductTypes.length}</div>
                <p className="text-sm text-primary mt-1">Unique categories identified</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Grid3X3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-300 border-2">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Confidence Analysis</p>
                <p className="text-xs text-orange-500 mt-1">AI classification confidence</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-center">
                    <span className="text-xl font-bold text-primary">{totalHigh}</span>
                    <p className="text-xs text-muted-foreground">High</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-bold text-muted-foreground">{totalMed}</span>
                    <p className="text-xs text-muted-foreground">Medium</p>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-bold text-destructive">{totalLow}</span>
                    <p className="text-xs text-muted-foreground">Low</p>
                  </div>
                </div>
              </div>
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Types Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Product Types</h2>
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search charges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProductType(product)}
            >
              <CardContent className="pt-6">
                <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.charges} charges</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    High: {product.high}
                  </Badge>
                  <Badge variant="outline" className="text-muted-foreground">
                    Med: {product.med}
                  </Badge>
                  <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
                    Low: {product.low}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
