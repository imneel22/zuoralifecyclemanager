import { useState } from 'react';
import { Building2, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Implementation, BusinessModel } from '@/types/zlm';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface OverviewTabProps {
  implementation: Implementation;
}

const businessModelLabels: Record<BusinessModel, string> = {
  subscription: 'Subscription',
  usage: 'Usage-Based',
  hybrid: 'Hybrid',
};

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
}

export function OverviewTab({ implementation }: OverviewTabProps) {
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

    // Simulate AI response
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

  const getCompanyBackground = () => {
    return `${implementation.customerName} is a ${implementation.industry.toLowerCase()} company that has partnered with Zuora for their ${onboardingType === 'billing' ? 'billing and subscription management' : 'revenue recognition and compliance'} needs. ${implementation.projectDescription || ''}`;
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
      {/* Customer Overview - Left Side */}
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
            {/* Overview Header */}
            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">
                Overview of {implementation.customerName} for Zuora {onboardingType === 'billing' ? 'Billing' : 'Revenue'} Onboarding
              </h3>
            </div>

            {/* Company Background */}
            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Company Background</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getCompanyBackground()}
              </p>
            </div>

            {/* Business Model */}
            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Business Model</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getBusinessModelDescription()}
              </p>
            </div>

            {/* Products and Solutions */}
            <div>
              <h4 className="text-base font-semibold text-primary mb-2">Products and Solutions</h4>
              <h5 className="text-sm font-medium mb-2">Core Products:</h5>
              <ul className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                {implementation.productTypes.map((product, index) => (
                  <li key={index}>
                    <span className="font-medium text-foreground">{product}</span>: {
                      onboardingType === 'billing' 
                        ? `Their ${product.toLowerCase()} offering for customers`
                        : `Revenue recognition for ${product.toLowerCase()} arrangements`
                    }
                  </li>
                ))}
              </ul>
            </div>

            {/* Key Implementation Details */}
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
                    {implementation.arr 
                      ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(implementation.arr)
                      : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-muted-foreground">Days to Go-Live</span>
                  <span className="font-medium text-primary">{implementation.daysToGoLive} days</span>
                </div>
              </div>
            </div>

            {/* Team Members */}
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

      {/* AI Chat Panel - Right Side */}
      <div className="lg:col-span-2">
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
            {/* Chat Messages */}
            <ScrollArea className="flex-1 pr-4 mb-4" style={{ maxHeight: '400px' }}>
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
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Chat Input */}
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
      </div>
    </div>
  );
}
