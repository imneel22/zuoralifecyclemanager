import { useState } from 'react';
import { Upload, FileText, Image, FileSpreadsheet, File, X, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Requirement {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'reviewed' | 'approved';
}

interface Artifact {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

const mockRequirements: Requirement[] = [
  { id: '1', title: 'Multi-currency support', description: 'Need to support USD, EUR, and GBP for billing', priority: 'high', status: 'approved' },
  { id: '2', title: 'Custom invoice templates', description: 'Branded invoice templates with company logo', priority: 'medium', status: 'reviewed' },
  { id: '3', title: 'Usage-based billing', description: 'Track API calls and bill based on consumption', priority: 'high', status: 'pending' },
];

const mockArtifacts: Artifact[] = [
  { id: '1', name: 'Current_Pricing_Model.xlsx', type: 'spreadsheet', size: 245000, uploadedAt: '2024-01-15' },
  { id: '2', name: 'Brand_Guidelines.pdf', type: 'document', size: 1200000, uploadedAt: '2024-01-14' },
  { id: '3', name: 'Invoice_Template.png', type: 'image', size: 89000, uploadedAt: '2024-01-13' },
];

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const getFileIcon = (type: string) => {
  switch (type) {
    case 'image':
      return <Image className="h-5 w-5 text-purple-500" />;
    case 'spreadsheet':
      return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
    case 'document':
      return <FileText className="h-5 w-5 text-blue-500" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
};

const priorityConfig = {
  low: { label: 'Low', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  high: { label: 'High', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

const statusConfig = {
  pending: { label: 'Pending', className: 'bg-muted text-muted-foreground' },
  reviewed: { label: 'Reviewed', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

export function DiscoveryTab() {
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [artifacts, setArtifacts] = useState<Artifact[]>(mockArtifacts);
  const [showAddRequirement, setShowAddRequirement] = useState(false);
  const [newRequirement, setNewRequirement] = useState<{ title: string; description: string; priority: 'low' | 'medium' | 'high' }>({ title: '', description: '', priority: 'medium' });

  const handleAddRequirement = () => {
    if (!newRequirement.title.trim()) return;
    
    const requirement: Requirement = {
      id: Date.now().toString(),
      title: newRequirement.title,
      description: newRequirement.description,
      priority: newRequirement.priority,
      status: 'pending',
    };
    
    setRequirements([...requirements, requirement]);
    setNewRequirement({ title: '', description: '', priority: 'medium' });
    setShowAddRequirement(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const type = file.type.includes('image') ? 'image' 
        : file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv') ? 'spreadsheet'
        : 'document';
      
      const artifact: Artifact = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type,
        size: file.size,
        uploadedAt: new Date().toISOString().split('T')[0],
      };
      
      setArtifacts((prev) => [...prev, artifact]);
    });
    
    event.target.value = '';
  };

  const removeArtifact = (id: string) => {
    setArtifacts(artifacts.filter((a) => a.id !== id));
  };

  const removeRequirement = (id: string) => {
    setRequirements(requirements.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Requirements Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Requirements</CardTitle>
            <CardDescription>Customer requirements and specifications</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddRequirement(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Requirement
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddRequirement && (
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <Input
                placeholder="Requirement title"
                value={newRequirement.title}
                onChange={(e) => setNewRequirement({ ...newRequirement, title: e.target.value })}
              />
              <Textarea
                placeholder="Description (optional)"
                value={newRequirement.description}
                onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                rows={2}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Priority:</span>
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <Button
                    key={p}
                    type="button"
                    size="sm"
                    variant={newRequirement.priority === p ? 'default' : 'outline'}
                    onClick={() => setNewRequirement({ ...newRequirement, priority: p })}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddRequirement}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddRequirement(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {requirements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No requirements added yet</p>
              <p className="text-sm">Click "Add Requirement" to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  <CheckCircle2 className={`h-5 w-5 mt-0.5 ${req.status === 'approved' ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{req.title}</span>
                      <Badge className={priorityConfig[req.priority].className}>
                        {priorityConfig[req.priority].label}
                      </Badge>
                      <Badge className={statusConfig[req.status].className}>
                        {statusConfig[req.status].label}
                      </Badge>
                    </div>
                    {req.description && (
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeRequirement(req.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Artifacts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Artifacts</CardTitle>
          <CardDescription>Upload images, documents, spreadsheets, and other files</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Images, Excel, PDF, Word documents
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
              onChange={handleFileUpload}
            />
          </label>

          {/* Uploaded Files */}
          {artifacts.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {artifacts.map((artifact) => (
                <div
                  key={artifact.id}
                  className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors group"
                >
                  {getFileIcon(artifact.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{artifact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(artifact.size)} • {artifact.uploadedAt}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeArtifact(artifact.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
