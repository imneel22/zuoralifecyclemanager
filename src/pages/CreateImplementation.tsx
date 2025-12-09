import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Building2, Briefcase, BarChart3, Plug, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Header } from '@/components/zlm/Header';
import { WizardStepper } from '@/components/zlm/WizardStepper';
import { AIRecommendation } from '@/components/zlm/AIRecommendation';
import { industries, productTypes, chargingMethods, integrations, mockTeamMembers } from '@/data/mockData';
import { WizardStep } from '@/types/zlm';
import { useToast } from '@/hooks/use-toast';

const steps: WizardStep[] = [
  { id: 'basic', title: 'Basic Information', description: 'Customer details', isComplete: false, isActive: true },
  { id: 'business', title: 'Business Model', description: 'Products & pricing', isComplete: false, isActive: false },
  { id: 'complexity', title: 'Complexity', description: 'Assessment', isComplete: false, isActive: false },
  { id: 'integrations', title: 'Integrations', description: 'Connected systems', isComplete: false, isActive: false },
  { id: 'review', title: 'Review', description: 'Confirm & create', isComplete: false, isActive: false },
];

export default function CreateImplementation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    customerName: '',
    sfdcOpportunityId: '',
    targetGoLive: '',
    teamLead: '',
    industry: '',
    productTypes: [] as string[],
    chargingMethods: [] as string[],
    dataVolume: 'medium',
    integrationCount: 'few',
    customizationLevel: 'standard',
    selectedIntegrations: [] as string[],
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayValue = (field: string, value: string) => {
    setFormData((prev) => {
      const arr = prev[field as keyof typeof prev] as string[];
      const newArr = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...prev, [field]: newArr };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = () => {
    toast({
      title: 'Implementation Created',
      description: `${formData.customerName} has been added to your implementations.`,
    });
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  placeholder="Enter customer name"
                  value={formData.customerName}
                  onChange={(e) => updateFormData('customerName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sfdcId">SFDC Opportunity ID</Label>
                <Input
                  id="sfdcId"
                  placeholder="OPP-2024-XXX"
                  value={formData.sfdcOpportunityId}
                  onChange={(e) => updateFormData('sfdcOpportunityId', e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="targetGoLive">Target Go-Live Date *</Label>
                <Input
                  id="targetGoLive"
                  type="date"
                  value={formData.targetGoLive}
                  onChange={(e) => updateFormData('targetGoLive', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamLead">Implementation Lead</Label>
                <Select value={formData.teamLead} onValueChange={(v) => updateFormData('teamLead', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockTeamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <AIRecommendation
              title="Industry Insight"
              description="Based on the customer name, this appears to be a Technology company. Technology implementations typically require usage-based billing and API integrations."
            />
            <div className="space-y-2">
              <Label>Industry *</Label>
              <Select value={formData.industry} onValueChange={(v) => updateFormData('industry', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Product Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {productTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.productTypes.includes(type)}
                      onCheckedChange={() => toggleArrayValue('productTypes', type)}
                    />
                    <Label htmlFor={type} className="text-sm font-normal cursor-pointer">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Charging Methods</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {chargingMethods.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.chargingMethods.includes(method)}
                      onCheckedChange={() => toggleArrayValue('chargingMethods', method)}
                    />
                    <Label htmlFor={method} className="text-sm font-normal cursor-pointer">
                      {method}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Expected Data Volume</Label>
              <RadioGroup
                value={formData.dataVolume}
                onValueChange={(v) => updateFormData('dataVolume', v)}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: 'low', label: 'Low', desc: '< 10K records' },
                  { value: 'medium', label: 'Medium', desc: '10K - 100K records' },
                  { value: 'high', label: 'High', desc: '> 100K records' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="sr-only" />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.desc}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label>Number of Integrations</Label>
              <RadioGroup
                value={formData.integrationCount}
                onValueChange={(v) => updateFormData('integrationCount', v)}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: 'few', label: 'Few', desc: '1-2 systems' },
                  { value: 'moderate', label: 'Moderate', desc: '3-5 systems' },
                  { value: 'many', label: 'Many', desc: '6+ systems' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`int-${option.value}`}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value={option.value} id={`int-${option.value}`} className="sr-only" />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.desc}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div className="space-y-4">
              <Label>Customization Level</Label>
              <RadioGroup
                value={formData.customizationLevel}
                onValueChange={(v) => updateFormData('customizationLevel', v)}
                className="grid grid-cols-3 gap-4"
              >
                {[
                  { value: 'standard', label: 'Standard', desc: 'Out-of-box' },
                  { value: 'moderate', label: 'Moderate', desc: 'Some custom' },
                  { value: 'heavy', label: 'Heavy', desc: 'Extensive custom' },
                ].map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`cust-${option.value}`}
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted p-4 hover:border-primary cursor-pointer [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value={option.value} id={`cust-${option.value}`} className="sr-only" />
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.desc}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <AIRecommendation
              title="Integration Recommendation"
              description="Based on your selections, I recommend integrating with Salesforce CRM and Stripe for payment processing. These are the most common integrations for Technology companies."
            />
            <div className="space-y-2">
              <Label>Required Integrations</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.selectedIntegrations.includes(integration.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                    onClick={() => toggleArrayValue('selectedIntegrations', integration.id)}
                  >
                    <div>
                      <p className="font-medium">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.category}</p>
                    </div>
                    <Checkbox
                      checked={formData.selectedIntegrations.includes(integration.id)}
                      onCheckedChange={() => toggleArrayValue('selectedIntegrations', integration.id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Summary</CardTitle>
                <CardDescription>Review the details before creating</CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-4 md:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Customer Name</dt>
                    <dd className="font-medium">{formData.customerName || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">SFDC Opportunity ID</dt>
                    <dd className="font-medium">{formData.sfdcOpportunityId || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Target Go-Live</dt>
                    <dd className="font-medium">
                      {formData.targetGoLive ? new Date(formData.targetGoLive).toLocaleDateString() : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Industry</dt>
                    <dd className="font-medium">{formData.industry || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Product Types</dt>
                    <dd className="font-medium">{formData.productTypes.join(', ') || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Integrations</dt>
                    <dd className="font-medium">
                      {formData.selectedIntegrations
                        .map((id) => integrations.find((i) => i.id === id)?.name)
                        .join(', ') || '—'}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const stepIcons = [Building2, Briefcase, BarChart3, Plug, FileCheck];
  const StepIcon = stepIcons[currentStep];

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <main className="container px-4 py-6 max-w-4xl">
        <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Create New Implementation</h1>
          <p className="text-muted-foreground">Set up a new customer implementation project</p>
        </div>

        <WizardStepper steps={steps} currentStep={currentStep} className="mb-8" />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <StepIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>{steps[currentStep].title}</CardTitle>
                <CardDescription>{steps[currentStep].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleCreate}>
              <Check className="mr-2 h-4 w-4" />
              Create Implementation
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
