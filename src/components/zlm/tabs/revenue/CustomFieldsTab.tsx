import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Layers, Plus, Search, Edit, Trash2 } from 'lucide-react';

const mockCustomFields = [
  { id: '1', name: 'Contract_Region', type: 'Picklist', object: 'Revenue Contract', required: true, status: 'Active' },
  { id: '2', name: 'Deal_Type', type: 'Picklist', object: 'Revenue Contract', required: true, status: 'Active' },
  { id: '3', name: 'Customer_Segment', type: 'Text', object: 'Account', required: false, status: 'Active' },
  { id: '4', name: 'Renewal_Probability', type: 'Number', object: 'Revenue Schedule', required: false, status: 'Active' },
  { id: '5', name: 'Implementation_Phase', type: 'Picklist', object: 'Performance Obligation', required: false, status: 'Draft' },
];

export function CustomFieldsTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFields = mockCustomFields.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Custom Fields</h2>
          <p className="text-muted-foreground">Extend revenue objects with custom attributes</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Custom Field
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">Total Fields</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">4</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-amber-600">2</div>
            <p className="text-sm text-muted-foreground">Required</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground">Objects Extended</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Custom Field Definitions</CardTitle>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search fields..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Object</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFields.map((field) => (
                <TableRow key={field.id}>
                  <TableCell className="font-medium font-mono text-sm">{field.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{field.type}</Badge>
                  </TableCell>
                  <TableCell>{field.object}</TableCell>
                  <TableCell>
                    {field.required ? (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">Optional</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={field.status === 'Active' ? 'default' : 'secondary'}>
                      {field.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
