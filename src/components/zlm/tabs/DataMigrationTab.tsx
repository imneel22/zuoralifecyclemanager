import { useState } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Clock, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockMigrationFiles, mockFieldMappings } from '@/data/mockData';
import { AIRecommendation } from '../AIRecommendation';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { icon: Clock, label: 'Pending', className: 'bg-slate-100 text-slate-600' },
  processing: { icon: RefreshCw, label: 'Processing', className: 'bg-blue-100 text-blue-600' },
  validated: { icon: CheckCircle2, label: 'Validated', className: 'bg-green-100 text-green-600' },
  error: { icon: AlertCircle, label: 'Error', className: 'bg-red-100 text-red-600' },
};

export function DataMigrationTab() {
  const [showMapping, setShowMapping] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <AIRecommendation
        title="Data Quality Alert"
        description="I detected 12 duplicate customer records in your upload. Consider enabling deduplication rules before migration to prevent billing errors."
        onAccept={() => console.log('Enable deduplication')}
      />

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Data Files</CardTitle>
          <CardDescription>Upload CSV or Excel files for migration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
            <Button variant="outline" size="sm">
              Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Uploaded Files</CardTitle>
              <CardDescription>{mockMigrationFiles.length} files uploaded</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowMapping(!showMapping)}>
              {showMapping ? 'Hide Mapping' : 'Review Mapping'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMigrationFiles.map((file) => {
                const status = statusConfig[file.status];
                const Icon = status.icon;
                return (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatFileSize(file.size)}</TableCell>
                    <TableCell>
                      {file.recordCount?.toLocaleString()}
                      {file.errorCount && file.errorCount > 0 && (
                        <span className="text-red-500 ml-2">({file.errorCount} errors)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('gap-1', status.className)}>
                        <Icon className={cn('h-3 w-3', file.status === 'processing' && 'animate-spin')} />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Field Mapping */}
      {showMapping && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">AI Field Mapping</CardTitle>
            <CardDescription>Review and adjust automated field mappings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source Field</TableHead>
                  <TableHead>Target Field</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFieldMappings.map((mapping, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">{mapping.sourceField}</TableCell>
                    <TableCell className="font-mono text-sm">{mapping.targetField}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={mapping.confidence} className="w-20 h-2" />
                        <span className={cn('text-sm font-medium', getConfidenceColor(mapping.confidence))}>
                          {mapping.confidence}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={mapping.status === 'unmapped' ? 'destructive' : 'secondary'}>
                        {mapping.status === 'auto' ? 'Auto-mapped' : mapping.status === 'manual' ? 'Manual' : 'Unmapped'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline">Reset Mappings</Button>
              <Button>Apply Mappings</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
