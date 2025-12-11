import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, FileText, Image, FileSpreadsheet, File, X, Plus, Trash2, Download, FileUp, Sparkles, AlertTriangle, Flag, Loader2, Search, ChevronLeft, ChevronRight, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type RequirementStatus = 'draft' | 'completed';
type RequirementClassification = 'fit' | 'gap';
type RequirementSection = 'price_to_offer' | 'lead_to_offer' | 'order_to_cash' | 'usage_to_bill' | 'general';
type RequirementPriority = 'low' | 'medium' | 'high' | 'critical';

interface Requirement {
  id: string;
  reqId: string;
  section: RequirementSection;
  description: string;
  status: RequirementStatus;
  classification: RequirementClassification;
  priority: RequirementPriority;
  owner: string;
  parentRequirement: string | null;
  tags: string[];
  fitGapScore?: number;
  fitGapRationale?: string;
  aoc?: string;
  aocDescription?: string;
  aocComplexity?: 'low' | 'medium' | 'high';
  isBaseline?: boolean;
  sourceArtifact?: string;
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

const priorityConfig: Record<RequirementPriority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400' },
  medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  high: { label: 'High', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  critical: { label: 'Critical', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
};

export function DiscoveryTab() {
  const navigate = useNavigate();
  const { id: implementationId } = useParams();
  const { toast } = useToast();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [showAddRequirement, setShowAddRequirement] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<'all' | RequirementClassification>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<'fitgap' | 'aoc' | 'rtm' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredRequirements = requirements.filter(req => {
    const matchesSearch = searchQuery === '' || 
      req.reqId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesClassification = classificationFilter === 'all' || req.classification === classificationFilter;
    
    return matchesSearch && matchesClassification;
  });

  const totalPages = Math.ceil(filteredRequirements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequirements = filteredRequirements.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleClassificationChange = (value: 'all' | RequirementClassification) => {
    setClassificationFilter(value);
    setCurrentPage(1);
  };
  const [newRequirement, setNewRequirement] = useState<{
    section: RequirementSection;
    description: string;
    status: RequirementStatus;
    classification: RequirementClassification;
    priority: RequirementPriority;
    owner: string;
    parentRequirement: string;
    tags: string[];
  }>({
    section: 'general',
    description: '',
    status: 'draft',
    classification: 'fit',
    priority: 'medium',
    owner: '',
    parentRequirement: '',
    tags: [],
  });

  const generateReqId = (existingReqs: Requirement[] = requirements) => {
    const maxId = existingReqs.reduce((max, req) => {
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
      priority: newRequirement.priority,
      owner: newRequirement.owner,
      parentRequirement: newRequirement.parentRequirement || null,
      tags: newRequirement.tags,
    };

    setRequirements([...requirements, requirement]);
    setNewRequirement({ section: 'general', description: '', status: 'draft', classification: 'fit', priority: 'medium', owner: '', parentRequirement: '', tags: [] });
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

  const handleExportRequirements = () => {
    const exportData = requirements.map(({ id, ...rest }) => rest);
    const csvHeader = 'reqId,section,description,status,classification,priority,owner,parentRequirement,tags\n';
    const csvContent = exportData.map(req => 
      `"${req.reqId}","${req.section}","${req.description.replace(/"/g, '""')}","${req.status}","${req.classification}","${req.priority}","${req.owner}","${req.parentRequirement || ''}","${req.tags.join(';')}"`
    ).join('\n');
    
    const blob = new Blob([csvHeader + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `requirements_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const handleImportRequirements = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const header = lines[0];
      
      // Skip header row
      const dataLines = lines.slice(1);
      
      let maxId = requirements.reduce((max, req) => {
        const num = parseInt(req.reqId.replace('REQ-', ''));
        return num > max ? num : max;
      }, 0);

      const importedReqs: Requirement[] = dataLines.map((line, index) => {
        // Parse CSV line (handling quoted fields)
        const matches = line.match(/("([^"]*(?:""[^"]*)*)"|[^,]*)(,|$)/g) || [];
        const values = matches.map(m => m.replace(/,$/g, '').replace(/^"|"$/g, '').replace(/""/g, '"'));
        
        maxId++;
        return {
          id: Date.now().toString() + index,
          reqId: values[0] || `REQ-${String(maxId).padStart(3, '0')}`,
          section: (values[1] as RequirementSection) || 'general',
          description: values[2] || '',
          status: (values[3] as RequirementStatus) || 'draft',
          classification: (values[4] as RequirementClassification) || 'fit',
          priority: (values[5] as RequirementPriority) || 'medium',
          owner: values[6] || '',
          parentRequirement: values[7] || null,
          tags: values[8] ? values[8].split(';').filter(t => t.trim()) : [],
        };
      }).filter(req => req.description.trim());

      setRequirements([...requirements, ...importedReqs]);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleRTMAgent = async () => {
    if (artifacts.length === 0) {
      toast({ title: "No artifacts", description: "Upload customer artifacts first to generate requirements", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisType('rtm');
    try {
      const { data, error } = await supabase.functions.invoke('rtm-agent', {
        body: { artifacts }
      });
      
      if (error) throw error;
      
      if (data?.requirements && Array.isArray(data.requirements)) {
        const newReqs: Requirement[] = [];
        let currentReqs = [...requirements];
        
        data.requirements.forEach((req: any, index: number) => {
          const newReq: Requirement = {
            id: Date.now().toString() + index,
            reqId: generateReqId(currentReqs),
            section: req.section || 'general',
            description: req.description || '',
            status: 'draft',
            classification: 'fit',
            priority: req.priority || 'medium',
            owner: '',
            parentRequirement: null,
            tags: req.tags || [],
            sourceArtifact: req.sourceArtifact,
          };
          newReqs.push(newReq);
          currentReqs = [...currentReqs, newReq];
        });
        
        setRequirements(prev => [...prev, ...newReqs]);
        toast({ title: "RTM Analysis Complete", description: `Generated ${newReqs.length} requirements from ${artifacts.length} artifacts` });
      }
    } catch (error) {
      console.error('RTM agent error:', error);
      toast({ title: "Analysis Failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
      setAnalysisType(null);
    }
  };

  const handleFitGapAnalysis = async () => {
    if (requirements.length === 0) {
      toast({ title: "No requirements", description: "Add requirements first to run analysis", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisType('fitgap');
    try {
      const { data, error } = await supabase.functions.invoke('analyze-requirements', {
        body: { requirements, analysisType: 'fitgap' }
      });
      
      if (error) throw error;
      
      if (data?.results) {
        setRequirements(prev => prev.map(req => {
          const analysis = data.results.find((r: any) => r.reqId === req.reqId);
          if (analysis) {
            return {
              ...req,
              classification: analysis.classification || req.classification,
              fitGapScore: analysis.fitGapScore,
              fitGapRationale: analysis.rationale,
            };
          }
          return req;
        }));
        toast({ title: "FIT/GAP Analysis Complete", description: `Analyzed ${data.results.length} requirements` });
      }
    } catch (error) {
      console.error('FIT/GAP analysis error:', error);
      toast({ title: "Analysis Failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
      setAnalysisType(null);
    }
  };

  const handleAOCAnalysis = async () => {
    if (requirements.length === 0) {
      toast({ title: "No requirements", description: "Add requirements first to run analysis", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    setAnalysisType('aoc');
    try {
      const { data, error } = await supabase.functions.invoke('analyze-requirements', {
        body: { requirements, analysisType: 'aoc' }
      });
      
      if (error) throw error;
      
      if (data?.results) {
        setRequirements(prev => prev.map(req => {
          const analysis = data.results.find((r: any) => r.reqId === req.reqId);
          if (analysis) {
            return {
              ...req,
              aoc: analysis.aoc,
              aocDescription: analysis.aocDescription,
              aocComplexity: analysis.complexityLevel,
            };
          }
          return req;
        }));
        toast({ title: "AOC Analysis Complete", description: `Identified complexity areas for ${data.results.length} requirements` });
      }
    } catch (error) {
      console.error('AOC analysis error:', error);
      toast({ title: "Analysis Failed", description: error instanceof Error ? error.message : "Unknown error", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
      setAnalysisType(null);
    }
  };

  const handleMarkBaseline = () => {
    setRequirements(prev => prev.map(req => ({ ...req, isBaseline: true })));
    toast({ title: "Baseline Marked", description: `${requirements.length} requirements marked as baseline` });
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Customer Artifacts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Step 1</Badge>
            <CardTitle className="text-lg">Customer Artifacts</CardTitle>
          </div>
          <CardDescription>Upload customer documents, spreadsheets, and files to extract requirements</CardDescription>
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

          {/* RTM Agent Button */}
          {artifacts.length > 0 && (
            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleRTMAgent}
                disabled={isAnalyzing}
                className="gap-2"
              >
                {isAnalyzing && analysisType === 'rtm' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
                Run RTM Agent
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Requirements Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Step 2</Badge>
              <CardTitle className="text-lg">Requirements</CardTitle>
            </div>
            <CardDescription>
              {requirements.length === 0 
                ? "Upload artifacts and run RTM Agent to generate requirements, or add manually"
                : "Customer requirements with section, status, and classification"
              }
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleFitGapAnalysis}
              disabled={isAnalyzing || requirements.length === 0}
            >
              {isAnalyzing && analysisType === 'fitgap' ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-1" />
              )}
              FIT/GAP Analysis
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleAOCAnalysis}
              disabled={isAnalyzing || requirements.length === 0}
            >
              {isAnalyzing && analysisType === 'aoc' ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4 mr-1" />
              )}
              Check AOCs
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleMarkBaseline}
              disabled={requirements.length === 0}
            >
              <Flag className="h-4 w-4 mr-1" />
              Mark Baseline
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportRequirements} disabled={requirements.length === 0}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <label>
              <Button size="sm" variant="outline" asChild>
                <span>
                  <FileUp className="h-4 w-4 mr-1" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleImportRequirements}
              />
            </label>
            <Button size="sm" onClick={() => setShowAddRequirement(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          {requirements.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID, description, owner, or tags..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={classificationFilter}
                onValueChange={handleClassificationChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classifications</SelectItem>
                  <SelectItem value="fit">Fit</SelectItem>
                  <SelectItem value="gap">Gap</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

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
              <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No requirements yet</p>
              <p className="text-sm">Upload artifacts and run RTM Agent, or add requirements manually</p>
            </div>
          ) : filteredRequirements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No requirements match your search</p>
              <p className="text-sm">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead className="w-[130px]">Section</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[90px]">Priority</TableHead>
                    <TableHead className="w-[90px]">Status</TableHead>
                    <TableHead className="w-[80px]">Classification</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequirements.map((req) => (
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
                        <Badge className={priorityConfig[req.priority].className}>
                          {priorityConfig[req.priority].label}
                        </Badge>
                      </TableCell>
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

          {/* Pagination */}
          {filteredRequirements.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRequirements.length)} of {filteredRequirements.length}</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(v) => {
                    setItemsPerPage(Number(v));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span>per page</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
