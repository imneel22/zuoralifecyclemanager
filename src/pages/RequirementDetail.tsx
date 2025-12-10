import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Calendar, User, Link2, History, FileText, Save, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/zlm/AppSidebar';
import { Header } from '@/components/zlm/Header';

type RequirementStatus = 'draft' | 'completed';
type RequirementClassification = 'fit' | 'gap';
type RequirementSection = 'price_to_offer' | 'lead_to_offer' | 'order_to_cash' | 'usage_to_bill' | 'general';

interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Dependency {
  id: string;
  reqId: string;
  description: string;
  type: 'blocks' | 'blocked_by' | 'relates_to';
}

interface HistoryLog {
  id: string;
  action: string;
  author: string;
  timestamp: string;
}

interface RequirementDetails {
  id: string;
  reqId: string;
  projectName: string;
  section: RequirementSection;
  description: string;
  status: RequirementStatus;
  classification: RequirementClassification;
  owner: string;
  createdDate: string;
  lastUpdatedDate: string;
  parentRequirement: string | null;
  fitGapScore: number;
  scoreRationale: string;
  salesforceAOC: string;
  aocDescription: string;
  source: string;
  notes: Note[];
  dependencies: Dependency[];
  history: HistoryLog[];
}

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

const dependencyTypeConfig = {
  blocks: { label: 'Blocks', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  blocked_by: { label: 'Blocked By', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  relates_to: { label: 'Relates To', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

// Mock data for requirement detail
const mockRequirementData: RequirementDetails = {
  id: '1',
  reqId: 'REQ-001',
  projectName: 'Acme Corp - Enterprise',
  section: 'price_to_offer',
  description: 'Need to support USD, EUR, and GBP for billing with dynamic currency conversion',
  status: 'completed',
  classification: 'fit',
  owner: 'Sarah Johnson',
  createdDate: '2024-01-10',
  lastUpdatedDate: '2024-01-18',
  parentRequirement: null,
  fitGapScore: 85,
  scoreRationale: 'The standard multi-currency module supports USD, EUR, and GBP natively. Dynamic conversion requires minor configuration.',
  salesforceAOC: 'Pricing & Billing',
  aocDescription: 'Area covering all pricing configurations, currency management, and billing cycle settings.',
  source: 'Customer Workshop - Day 1',
  notes: [
    { id: '1', content: 'Confirmed with finance team that real-time FX rates are needed', author: 'John Smith', createdAt: '2024-01-12' },
    { id: '2', content: 'Integration with XE API approved for currency conversion', author: 'Sarah Johnson', createdAt: '2024-01-15' },
  ],
  dependencies: [
    { id: '1', reqId: 'REQ-005', description: 'Payment gateway integration', type: 'blocks' },
    { id: '2', reqId: 'REQ-003', description: 'Usage tracking system', type: 'relates_to' },
  ],
  history: [
    { id: '1', action: 'Status changed from Draft to Completed', author: 'Sarah Johnson', timestamp: '2024-01-18 14:30' },
    { id: '2', action: 'Classification changed from Gap to Fit', author: 'John Smith', timestamp: '2024-01-15 10:00' },
    { id: '3', action: 'Requirement created', author: 'Sarah Johnson', timestamp: '2024-01-10 09:00' },
  ],
};

export default function RequirementDetail() {
  const { implementationId, reqId } = useParams();
  const navigate = useNavigate();
  
  const [requirement, setRequirement] = useState<RequirementDetails>(mockRequirementData);
  const [newNote, setNewNote] = useState('');
  const [showAddDependency, setShowAddDependency] = useState(false);
  const [newDependency, setNewDependency] = useState<{ reqId: string; description: string; type: 'blocks' | 'blocked_by' | 'relates_to' }>({ reqId: '', description: '', type: 'relates_to' });

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      author: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setRequirement({ ...requirement, notes: [...requirement.notes, note] });
    setNewNote('');
  };

  const handleAddDependency = () => {
    if (!newDependency.reqId.trim() || !newDependency.description.trim()) return;
    
    const dependency: Dependency = {
      id: Date.now().toString(),
      reqId: newDependency.reqId,
      description: newDependency.description,
      type: newDependency.type,
    };
    
    setRequirement({ ...requirement, dependencies: [...requirement.dependencies, dependency] });
    setNewDependency({ reqId: '', description: '', type: 'relates_to' });
    setShowAddDependency(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            {/* Back Button & Header */}
            <div className="mb-6">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/implementation/${implementationId}`)}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Implementation
              </Button>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold">{requirement.reqId}</h1>
                    <Badge className={statusConfig[requirement.status].className}>
                      {statusConfig[requirement.status].label}
                    </Badge>
                    <Badge className={classificationConfig[requirement.classification].className}>
                      {classificationConfig[requirement.classification].label}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{requirement.description}</p>
                </div>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Core Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Core Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Project</label>
                      <p className="font-medium">{requirement.projectName}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Section</label>
                      <div>
                        <Badge className={sectionConfig[requirement.section].className}>
                          {sectionConfig[requirement.section].label}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Owner</label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{requirement.owner}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Source</label>
                      <p>{requirement.source}</p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Created Date</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{requirement.createdDate}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Last Updated</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{requirement.lastUpdatedDate}</span>
                      </div>
                    </div>
                    {requirement.parentRequirement && (
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-sm text-muted-foreground">Parent Requirement</label>
                        <p className="font-mono">{requirement.parentRequirement}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* FIT/GAP Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">FIT/GAP Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                        <span className="text-2xl font-bold text-primary">{requirement.fitGapScore}%</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${requirement.fitGapScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm text-muted-foreground">Score Rationale</label>
                      <p className="text-sm">{requirement.scoreRationale}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Salesforce AOC */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Salesforce Area of Complexity (AOC)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                      <span className="font-medium">{requirement.salesforceAOC}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{requirement.aocDescription}</p>
                  </CardContent>
                </Card>

                {/* Notes Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Notes</CardTitle>
                      <CardDescription>Add observations and comments</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Add a new note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={2}
                        className="flex-1"
                      />
                      <Button onClick={handleAddNote} size="sm" className="self-end">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator />
                    <div className="space-y-3">
                      {requirement.notes.map((note) => (
                        <div key={note.id} className="p-3 border rounded-lg bg-muted/30">
                          <p className="text-sm">{note.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>{note.author}</span>
                            <span>•</span>
                            <span>{note.createdAt}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Dependencies Section */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Dependencies</CardTitle>
                      <CardDescription>Requirements that this depends on or blocks</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => setShowAddDependency(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {showAddDependency && (
                      <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <label className="text-sm font-medium">Requirement ID</label>
                            <Input
                              placeholder="e.g., REQ-010"
                              value={newDependency.reqId}
                              onChange={(e) => setNewDependency({ ...newDependency, reqId: e.target.value })}
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm font-medium">Type</label>
                            <Select
                              value={newDependency.type}
                              onValueChange={(v: 'blocks' | 'blocked_by' | 'relates_to') => 
                                setNewDependency({ ...newDependency, type: v })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blocks">Blocks</SelectItem>
                                <SelectItem value="blocked_by">Blocked By</SelectItem>
                                <SelectItem value="relates_to">Relates To</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Input
                          placeholder="Description"
                          value={newDependency.description}
                          onChange={(e) => setNewDependency({ ...newDependency, description: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleAddDependency}>Save</Button>
                          <Button size="sm" variant="ghost" onClick={() => setShowAddDependency(false)}>Cancel</Button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {requirement.dependencies.map((dep) => (
                        <div key={dep.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                          <Link2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm font-medium">{dep.reqId}</span>
                          <Badge className={dependencyTypeConfig[dep.type].className}>
                            {dependencyTypeConfig[dep.type].label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{dep.description}</span>
                        </div>
                      ))}
                      {requirement.dependencies.length === 0 && !showAddDependency && (
                        <p className="text-sm text-muted-foreground text-center py-4">No dependencies defined</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - History Log */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <History className="h-4 w-4" />
                      History Log
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {requirement.history.map((log, index) => (
                        <div key={log.id} className="relative pl-6">
                          {index < requirement.history.length - 1 && (
                            <div className="absolute left-[9px] top-6 bottom-0 w-px bg-border" />
                          )}
                          <div className="absolute left-0 top-1 h-[18px] w-[18px] rounded-full border-2 border-primary bg-background" />
                          <div>
                            <p className="text-sm">{log.action}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{log.author}</span>
                              <span>•</span>
                              <span>{log.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Quick Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className={statusConfig[requirement.status].className}>
                        {statusConfig[requirement.status].label}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Classification</span>
                      <Badge className={classificationConfig[requirement.classification].className}>
                        {classificationConfig[requirement.classification].label}
                      </Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FIT Score</span>
                      <span className="font-medium">{requirement.fitGapScore}%</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Notes</span>
                      <span className="font-medium">{requirement.notes.length}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dependencies</span>
                      <span className="font-medium">{requirement.dependencies.length}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
