import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GitBranch, Plus, CheckCircle2, Clock, AlertTriangle, Eye } from 'lucide-react';

const mockChanges = [
  { 
    id: '1', 
    name: 'Add New Product Line', 
    type: 'Product Addition', 
    requestedBy: 'Sarah Chen',
    requestedDate: '2024-02-10',
    status: 'Approved',
    impact: 'Medium'
  },
  { 
    id: '2', 
    name: 'Update SSP for Enterprise License', 
    type: 'Pricing Change', 
    requestedBy: 'Michael Torres',
    requestedDate: '2024-02-12',
    status: 'Pending Review',
    impact: 'High'
  },
  { 
    id: '3', 
    name: 'Modify Recognition Rule', 
    type: 'Policy Change', 
    requestedBy: 'Emily Watson',
    requestedDate: '2024-02-14',
    status: 'In Progress',
    impact: 'High'
  },
  { 
    id: '4', 
    name: 'Add Custom Field', 
    type: 'Configuration', 
    requestedBy: 'James Kim',
    requestedDate: '2024-02-15',
    status: 'Approved',
    impact: 'Low'
  },
];

export function ChangeManagerTab() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Pending Review':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return <Badge variant="destructive">{impact}</Badge>;
      case 'Medium':
        return <Badge variant="default">{impact}</Badge>;
      case 'Low':
        return <Badge variant="secondary">{impact}</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Change Manager</h2>
          <p className="text-muted-foreground">Track and manage configuration changes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Change Request
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">4</div>
            <p className="text-sm text-muted-foreground">Total Changes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-sm text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">1</div>
            <p className="text-sm text-muted-foreground">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Change Requests</CardTitle>
          </div>
          <CardDescription>All configuration change requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Change Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Impact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockChanges.map((change) => (
                <TableRow key={change.id}>
                  <TableCell className="font-medium">{change.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{change.type}</Badge>
                  </TableCell>
                  <TableCell>{change.requestedBy}</TableCell>
                  <TableCell className="text-muted-foreground">{change.requestedDate}</TableCell>
                  <TableCell>{getImpactBadge(change.impact)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(change.status)}
                      <span className="text-sm">{change.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
