import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DollarSign, Grid3X3, BarChart3, Search, RefreshCw } from 'lucide-react';

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

export function WhatTheySellTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = mockProductTypes.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCharges = mockProductTypes.reduce((sum, p) => sum + p.charges, 0);
  const totalHigh = mockProductTypes.reduce((sum, p) => sum + p.high, 0);
  const totalMed = mockProductTypes.reduce((sum, p) => sum + p.med, 0);
  const totalLow = mockProductTypes.reduce((sum, p) => sum + p.low, 0);

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
            <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer">
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
