import { useState } from 'react';
import { Calendar, FileText, Settings, Database, CheckCircle2, Clock, Circle, Building2, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Implementation, Phase, BusinessModel } from '@/types/zlm';
import { TeamAvatars } from '../TeamAvatars';
import { AIRecommendation } from '../AIRecommendation';
import { AIWorkflowSettings } from '../AIWorkflowSettings';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OverviewTabProps {
  implementation: Implementation;
}

const phases: { id: Phase; label: string }[] = [
  { id: 'discovery', label: 'Discovery' },
  { id: 'configuration', label: 'Configuration' },
  { id: 'migration', label: 'Migration' },
  { id: 'testing', label: 'Testing' },
  { id: 'golive', label: 'Go-Live' },
];

const businessModelLabels: Record<BusinessModel, string> = {
  subscription: 'Subscription',
  usage: 'Usage-Based',
  hybrid: 'Hybrid',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

// AI Chat Panel Component
function AIChatPanel({ implementation }: { implementation: Implementation }) {
  const { onboardingType } = useOnboarding();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm here to help you learn more about ${implementation.customerName}. Ask me anything about their business, subscriptions, or implementation details.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    },
  ]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput('');

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Based on the implementation data for ${implementation.customerName}, I can help you with information about their ${implementation.businessModel || 'business'} model, ${implementation.industry} industry context, and their ${onboardingType} onboarding progress. What specific details would you like to know?`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Ask Questions About This Customer</CardTitle>
            <CardDescription>Get insights about {implementation.customerName}&apos;s {onboardingType} data</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 pr-4 mb-4" style={{ maxHeight: '350px' }}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                {message.role === 'assistant' && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[85%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`rounded-lg px-4 py-2.5 ${
                    message.role === 'assistant' 
                      ? 'bg-muted/50 text-foreground' 
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Input
            placeholder={`Ask me anything about ${implementation.customerName}...`}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!chatInput.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Billing Overview Layout
function BillingOverview({ implementation }: OverviewTabProps) {
  const navigate = useNavigate();
  const currentPhaseIndex = phases.findIndex((p) => p.id === implementation.currentPhase);
  const progress = ((currentPhaseIndex + 1) / phases.length) * 100;

  const getPhaseDate = (phaseId: Phase) => {
    return implementation.phaseDates?.find((p) => p.phase === phaseId);
  };

  const getStatusIcon = (status: 'completed' | 'in_progress' | 'pending') => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-primary animate-pulse" />;
      case 'pending':
        return <Circle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <AIRecommendation
          title="AI Insight"
          description="Based on similar implementations, consider scheduling the data migration review earlier. Companies in the Technology sector typically need 2 extra days for API integration testing."
          onAccept={() => console.log('Accepted recommendation')}
        />

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-muted-foreground">SFDC Opportunity ID</dt>
                <dd className="font-medium">{implementation.sfdcOpportunityId}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Industry</dt>
                <dd className="font-medium">{implementation.industry}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">ARR</dt>
                <dd className="font-medium text-green-600">
                  {implementation.arr ? formatCurrency(implementation.arr) : '—'}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Business Model</dt>
                <dd>
                  <Badge variant={
                    implementation.businessModel === 'hybrid' ? 'default' :
                    implementation.businessModel === 'subscription' ? 'secondary' : 'outline'
                  }>
                    {implementation.businessModel ? businessModelLabels[implementation.businessModel] : '—'}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Target Go-Live</dt>
                <dd className="font-medium">{formatDate(implementation.targetGoLive)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Product Types</dt>
                <dd className="font-medium">{implementation.productTypes.join(', ')}</dd>
              </div>
              <div className="sm:col-span-3">
                <dt className="text-sm text-muted-foreground">Project Description</dt>
                <dd className="font-medium">{implementation.projectDescription || '—'}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Implementation Timeline</CardTitle>
            <CardDescription>Current phase: {phases[currentPhaseIndex]?.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Progress value={progress} className="h-2" />
              
              <div className="space-y-3">
                {phases.map((phase) => {
                  const phaseDate = getPhaseDate(phase.id);
                  const status = phaseDate?.status || 'pending';
                  
                  return (
                    <div 
                      key={phase.id} 
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        status === 'in_progress' ? 'bg-primary/5 border border-primary/20' : 
                        status === 'completed' ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {getStatusIcon(status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-medium ${
                            status === 'in_progress' ? 'text-primary' : 
                            status === 'completed' ? 'text-foreground' : 'text-muted-foreground'
                          }`}>
                            {phase.label}
                          </span>
                          <Badge variant={
                            status === 'completed' ? 'default' :
                            status === 'in_progress' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {status === 'completed' ? 'Completed' : 
                             status === 'in_progress' ? 'In Progress' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          {phaseDate?.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Started: {formatDate(phaseDate.startDate)}
                            </span>
                          )}
                          {phaseDate?.endDate && (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Ended: {formatDate(phaseDate.endDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* AI Chat Panel - At the top */}
        <AIChatPanel implementation={implementation} />

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <AIWorkflowSettings implementationId={implementation.id} />
              <Button variant="outline" className="justify-start h-auto py-3" onClick={() => navigate('/product-catalog')}>
                <Settings className="mr-2 h-5 w-5 text-secondary" />
                <div className="text-left">
                  <p className="font-medium text-sm">Configure Products</p>
                  <p className="text-xs text-muted-foreground">Set up catalog</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3">
                <Database className="mr-2 h-5 w-5 text-amber-500" />
                <div className="text-left">
                  <p className="font-medium text-sm">Migrate Data</p>
                  <p className="text-xs text-muted-foreground">Import records</p>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3">
                <FileText className="mr-2 h-5 w-5 text-purple-500" />
                <div className="text-left">
                  <p className="font-medium text-sm">View Tasks</p>
                  <p className="text-xs text-muted-foreground">5 pending</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {implementation.team.map((member) => (
                <div key={member.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Dates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Kickoff</span>
                <span className="text-sm font-medium">{formatDate(implementation.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Target Go-Live</span>
                <span className="text-sm font-medium">{formatDate(implementation.targetGoLive)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Days Remaining</span>
                <span className="text-sm font-medium text-primary">{implementation.daysToGoLive} days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Revenue Overview Layout
function RevenueOverview({ implementation }: OverviewTabProps) {
  const { onboardingType } = useOnboarding();

  const getCompanyBackground = () => {
    return `${implementation.customerName} is a ${implementation.industry.toLowerCase()} company that has partnered with Zuora for their revenue recognition and compliance needs. ${implementation.projectDescription || ''}`;
  };

  const getBusinessModelDescription = () => {
    const model = implementation.businessModel || 'subscription';
    const descriptions: Record<BusinessModel, string> = {
      subscription: `${implementation.customerName} operates on a Subscription business model, providing recurring services to their customers. Their platform enables organizations to access ongoing value through monthly or annual subscription plans.`,
      usage: `${implementation.customerName} operates on a Usage-Based business model, providing consumption-based pricing for their services. Customers are charged based on actual usage metrics, enabling flexible and scalable pricing.`,
      hybrid: `${implementation.customerName} operates on a Hybrid business model, combining subscription and usage-based pricing. This approach provides customers with a base subscription plus additional charges based on consumption.`,
    };
    return descriptions[model];
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card className="border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Customer Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Overview of {implementation.customerName} for Zuora Revenue Onboarding
              </h3>
            </div>

            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Company Background</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getCompanyBackground()}
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Business Model</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getBusinessModelDescription()}
              </p>
            </div>

            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Products and Solutions</h4>
              <h5 className="text-sm font-medium mb-2">Core Products:</h5>
              <ul className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {implementation.productTypes.map((product, index) => (
                  <li key={index}>
                    <span className="font-medium text-foreground">{product}</span>: Revenue recognition for {product.toLowerCase()} arrangements
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Implementation Details</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">SFDC Opportunity</span>
                  <span className="font-medium">{implementation.sfdcOpportunityId}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{implementation.industry}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-muted-foreground">ARR</span>
                  <span className="font-medium text-green-600">
                    {implementation.arr ? formatCurrency(implementation.arr) : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Days to Go-Live</span>
                  <span className="font-medium text-primary">{implementation.daysToGoLive} days</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Team Members</h4>
              <div className="flex flex-wrap gap-2">
                {implementation.team.map((member) => (
                  <div key={member.id} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1.5">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">
                        {member.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <AIChatPanel implementation={implementation} />
      </div>
    </div>
  );
}

export function OverviewTab({ implementation }: OverviewTabProps) {
  const { onboardingType } = useOnboarding();

  if (onboardingType === 'billing') {
    return <BillingOverview implementation={implementation} />;
  }

  return <RevenueOverview implementation={implementation} />;
}
