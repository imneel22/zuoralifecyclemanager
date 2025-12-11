import { useState } from 'react';
import { Settings, Check, Pencil, X, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface WorkflowSetting {
  id: string;
  name: string;
  key: string;
  status: 'default' | 'customized';
}

const defaultWorkflows: WorkflowSetting[] = [
  { id: '1', name: 'Conflict Analyzer', key: 'app...gie3OtjPu8qKxFE9r6II', status: 'default' },
  { id: '2', name: 'Editor', key: 'app...hK7mNpQ2wXyZ8vB4cD1E', status: 'default' },
  { id: '3', name: 'RTM Analyzer', key: 'app...jL9oRsT5uVwX1yZ3aB2C', status: 'default' },
  { id: '4', name: 'Config Analyzer', key: 'app...mN4pQrS6tUvW8xY0zA1B', status: 'default' },
  { id: '5', name: 'FIT/GAP Analyzer', key: 'app...qR7sTuV9wXyZ2aB4cD5E', status: 'default' },
  { id: '6', name: 'AOC Analyzer', key: 'app...uV0wXyZ3aB5cD7eF8gH9', status: 'default' },
  { id: '7', name: 'Preprocessor', key: 'app...yZ4aB6cD8eF0gH2iJ3kL', status: 'default' },
  { id: '8', name: 'Image Processor', key: 'app...cD7eF9gH1iJ3kL5mN6oP', status: 'default' },
  { id: '9', name: 'Content Extractor', key: 'app...gH0iJ2kL4mN6oP8qR9sT', status: 'default' },
];

interface AIWorkflowSettingsProps {
  implementationId: string;
}

export function AIWorkflowSettings({ implementationId }: AIWorkflowSettingsProps) {
  const [workflows, setWorkflows] = useState<WorkflowSetting[]>(defaultWorkflows);
  const [isOpen, setIsOpen] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState<WorkflowSetting | null>(null);
  const [newKey, setNewKey] = useState('');

  const customizedCount = workflows.filter(w => w.status === 'customized').length;

  const handleCustomize = (workflow: WorkflowSetting) => {
    setEditingWorkflow(workflow);
    setNewKey(workflow.key);
  };

  const handleSave = () => {
    if (editingWorkflow && newKey.trim()) {
      setWorkflows(workflows.map(w => 
        w.id === editingWorkflow.id 
          ? { ...w, key: newKey, status: 'customized' as const }
          : w
      ));
      setEditingWorkflow(null);
      setNewKey('');
    }
  };

  const handleResetToDefault = (workflowId: string) => {
    const defaultWorkflow = defaultWorkflows.find(w => w.id === workflowId);
    if (defaultWorkflow) {
      setWorkflows(workflows.map(w => 
        w.id === workflowId 
          ? { ...w, key: defaultWorkflow.key, status: 'default' }
          : w
      ));
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="justify-start h-auto py-3 w-full"
        onClick={() => setIsOpen(true)}
      >
        <Cpu className="mr-2 h-5 w-5 text-primary" />
        <div className="text-left flex-1">
          <p className="font-medium text-sm">AI Workflow Settings</p>
          <p className="text-xs text-muted-foreground">
            {customizedCount > 0 ? `${customizedCount} customized` : 'All default'}
          </p>
        </div>
        <Settings className="h-4 w-4 text-muted-foreground" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              AI Workflow Settings
            </DialogTitle>
            <DialogDescription>
              Configure AI workflow keys for this project. Customized settings override the default configuration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {workflows.map((workflow) => (
              <div 
                key={workflow.id}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{workflow.name}</span>
                    <Badge 
                      variant={workflow.status === 'customized' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {workflow.status === 'customized' ? 'Customized' : 'Default'}
                    </Badge>
                  </div>
                  <code className="text-xs text-muted-foreground font-mono bg-background px-2 py-0.5 rounded">
                    {workflow.key}
                  </code>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {workflow.status === 'customized' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResetToDefault(workflow.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Reset
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCustomize(workflow)}
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Customize
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingWorkflow} onOpenChange={() => setEditingWorkflow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customize {editingWorkflow?.name}</DialogTitle>
            <DialogDescription>
              Enter a custom workflow key for this analyzer. This will override the default configuration for this project only.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Workflow Key</label>
              <Input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Enter workflow key..."
                className="font-mono text-sm"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Current default: <code className="bg-muted px-1 rounded">{defaultWorkflows.find(w => w.id === editingWorkflow?.id)?.key}</code></p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingWorkflow(null)}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
