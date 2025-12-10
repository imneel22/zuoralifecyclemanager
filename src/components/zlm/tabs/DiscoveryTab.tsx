import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, FileText, Image, FileSpreadsheet, File, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type RequirementStatus = 'draft' | 'completed';
type RequirementClassification = 'fit' | 'gap';
type RequirementSection = 'price_to_offer' | 'lead_to_offer' | 'order_to_cash' | 'usage_to_bill' | 'general';

interface Requirement {
  id: string;
  reqId: string;
  section: RequirementSection;
  description: string;
  status: RequirementStatus;
  classification: RequirementClassification;
  owner: string;
  parentRequirement: string | null;
  tags: string[];
}

interface Artifact {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

const sections: { value: RequirementSection; label: string }[] = [
  { value: 'price_to_offer', label: 'Price to Offer' },
  { value: 'lead_to_offer', label: 'Lead to Offer' },
  { value: 'order_to_cash', label: 'Order to Cash' },
  { value: 'usage_to_bill', label: 'Usage to Bill' },
  { value: 'general', label: 'General' },
];

const owners = ['Sarah Johnson', 'John Smith', 'Emily Chen', 'Michael Brown', 'Lisa Wang'];

const mockRequirements: Requirement[] = [
  { id: '1', reqId: 'REQ-001', section: 'price_to_offer', description: 'Need to support USD, EUR, and GBP for billing with dynamic currency conversion', status: 'completed', classification: 'fit', owner: 'Sarah Johnson', parentRequirement: null, tags: ['billing', 'currency'] },
  { id: '2', reqId: 'REQ-002', section: 'order_to_cash', description: 'Branded invoice templates with company logo and custom footer', status: 'draft', classification: 'gap', owner: 'John Smith', parentRequirement: 'REQ-001', tags: ['invoice', 'branding'] },
  { id: '3', reqId: 'REQ-003', section: 'usage_to_bill', description: 'Track API calls and bill based on consumption tiers', status: 'completed', classification: 'fit', owner: 'Emily Chen', parentRequirement: null, tags: ['api', 'usage'] },
  { id: '4', reqId: 'REQ-004', section: 'lead_to_offer', description: 'CRM integration for lead qualification scoring', status: 'draft', classification: 'gap', owner: 'Michael Brown', parentRequirement: null, tags: ['crm', 'integration'] },
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

const statusConfig = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  completed: { label: 'Completed', className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
};

const classificationConfig = {
  fit: { label: 'Fit', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  gap: { label: 'Gap', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
};

const sectionConfig: Record<RequirementSection, { label: string; className: string }> = {
  price_to_offer: { label: 'Price to Offer', className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  lead_to_offer: { label: 'Lead to Offer', className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  order_to_cash: { label: 'Order to Cash', className: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  usage_to_bill: { label: 'Usage to Bill', className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  general: { label: 'General', className: 'bg-muted text-muted-foreground' },
};

export function DiscoveryTab() {
  const navigate = useNavigate();
  const { id: implementationId } = useParams();
  const [requirements, setRequirements] = useState<Requirement[]>(mockRequirements);
  const [artifacts, setArtifacts] = useState<Artifact[]>(mockArtifacts);
  const [showAddRequirement, setShowAddRequirement] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [newRequirement, setNewRequirement] = useState<{
    section: RequirementSection;
    description: string;
    status: RequirementStatus;
    classification: RequirementClassification;
    owner: string;
    parentRequirement: string;
    tags: string[];
  }>({
    section: 'general',
    description: '',
    status: 'draft',
    classification: 'fit',
    owner: '',
    parentRequirement: '',
    tags: [],
  });

  const generateReqId = () => {
    const maxId = requirements.reduce((max, req) => {
      const num = parseInt(req.reqId.replace('REQ-', ''));
      return num > max ? num : max;
    }, 0);
    return `REQ-${String(maxId + 1).padStart(3, '0')}`;
  };

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !newRequirement.tags.includes(tag)) {
      setNewRequirement({ ...newRequirement, tags: [...newRequirement.tags, tag] });
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewRequirement({ ...newRequirement, tags: newRequirement.tags.filter(t => t !== tagToRemove) });
  };

  const handleAddRequirement = () => {
    if (!newRequirement.description.trim()) return;

    const requirement: Requirement = {
      id: Date.now().toString(),
      reqId: generateReqId(),
      section: newRequirement.section,
      description: newRequirement.description,
      status: newRequirement.status,
      classification: newRequirement.classification,
      owner: newRequirement.owner,
      parentRequirement: newRequirement.parentRequirement || null,
      tags: newRequirement.tags,
    };

    setRequirements([...requirements, requirement]);
    setNewRequirement({ section: 'general', description: '', status: 'draft', classification: 'fit', owner: '', parentRequirement: '', tags: [] });
    setTagInput('');
    setShowAddRequirement(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const type = file.type.includes('image')
        ? 'image'
        : file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.csv')
        ? 'spreadsheet'
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
            <CardDescription>Customer requirements with section, status, and classification</CardDescription>
          </div>
          <Button size="sm" onClick={() => setShowAddRequirement(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Requirement
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddRequirement && (
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Section</label>
                  <Select
                    value={newRequirement.section}
                    onValueChange={(v: RequirementSection) => setNewRequirement({ ...newRequirement, section: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sections.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Classification</label>
                  <Select
                    value={newRequirement.classification}
                    onValueChange={(v: RequirementClassification) =>
                      setNewRequirement({ ...newRequirement, classification: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fit">Fit</SelectItem>
                      <SelectItem value="gap">Gap</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Owner</label>
                  <Select
                    value={newRequirement.owner}
                    onValueChange={(v) => setNewRequirement({ ...newRequirement, owner: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner} value={owner}>
                          {owner}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Parent Requirement</label>
                  <Select
                    value={newRequirement.parentRequirement || "none"}
                    onValueChange={(v) => setNewRequirement({ ...newRequirement, parentRequirement: v === "none" ? "" : v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {requirements.map((req) => (
                        <SelectItem key={req.id} value={req.reqId}>
                          {req.reqId} - {req.description.slice(0, 30)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Textarea
                placeholder="Requirement description"
                value={newRequirement.description}
                onChange={(e) => setNewRequirement({ ...newRequirement, description: e.target.value })}
                rows={2}
              />
              <div className="space-y-1">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" variant="outline" onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                {newRequirement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newRequirement.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                {(['draft', 'completed'] as const).map((s) => (
                  <Button
                    key={s}
                    type="button"
                    size="sm"
                    variant={newRequirement.status === s ? 'default' : 'outline'}
                    onClick={() => setNewRequirement({ ...newRequirement, status: s })}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddRequirement}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddRequirement(false)}>
                  Cancel
                </Button>
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
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="w-[140px]">Section</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[80px]">Classification</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map((req) => (
                    <TableRow 
                      key={req.id} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/implementation/${implementationId}/requirement/${req.reqId}`)}
                    >
                      <TableCell className="font-mono text-sm font-medium">{req.reqId}</TableCell>
                      <TableCell>
                        <Badge className={sectionConfig[req.section].className}>
                          {sectionConfig[req.section].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{req.description}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[req.status].className}>
                          {statusConfig[req.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={classificationConfig[req.classification].className}>
                          {classificationConfig[req.classification].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRequirement(req.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              <p className="text-xs text-muted-foreground mt-1">Images, Excel, PDF, Word documents</p>
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
