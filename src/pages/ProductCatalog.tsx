import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Package, CreditCard, Zap, BarChart2, Percent, Eye, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Header } from '@/components/zlm/Header';
import { WizardStepper } from '@/components/zlm/WizardStepper';
import { AIRecommendation } from '@/components/zlm/AIRecommendation';
import { WizardStep } from '@/types/zlm';
import { useToast } from '@/hooks/use-toast';

const steps: WizardStep[] = [
  { id: 'products', title: 'Products', description: 'Define products', isComplete: false, isActive: true },
  { id: 'rateplans', title: 'Rate Plans', description: 'Configure pricing', isComplete: false, isActive: false },
  { id: 'charges', title: 'Charges', description: 'Set up charges', isComplete: false, isActive: false },
  { id: 'usage', title: 'Usage', description: 'Usage billing', isComplete: false, isActive: false },
  { id: 'discounts', title: 'Discounts', description: 'Discount rules', isComplete: false, isActive: false },
  { id: 'preview', title: 'Preview', description: 'Review catalog', isComplete: false, isActive: false },
  { id: 'deploy', title: 'Deploy', description: 'Push to Zuora', isComplete: false, isActive: false },
];

export default function ProductCatalog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Products
    productName: '',
    productDescription: '',
    productSku: '',
    // Rate Plans
    ratePlanName: '',
    ratePlanType: 'standard',
    billingPeriod: 'monthly',
    // Charges
    chargeName: '',
    chargeType: 'recurring',
    chargeModel: 'flat_fee',
    price: '',
    // Usage
    usageEnabled: false,
    usageUnit: '',
    usagePrice: '',
    // Discounts
    discountEnabled: false,
    discountType: 'percentage',
    discountValue: '',
  });

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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

  const handleDeploy = () => {
    toast({
      title: 'Catalog Deployed',
      description: 'Your product catalog has been pushed to Zuora.',
    });
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <AIRecommendation
              title="Product Structure Suggestion"
              description="For SaaS products, I recommend creating a single product with multiple rate plans (e.g., Basic, Pro, Enterprise) rather than separate products for each tier."
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="e.g., Cloud Platform"
                  value={formData.productName}
                  onChange={(e) => updateFormData('productName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  placeholder="Describe your product..."
                  value={formData.productDescription}
                  onChange={(e) => updateFormData('productDescription', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="productSku">SKU</Label>
                <Input
                  id="productSku"
                  placeholder="e.g., SKU-001"
                  value={formData.productSku}
                  onChange={(e) => updateFormData('productSku', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ratePlanName">Rate Plan Name *</Label>
                <Input
                  id="ratePlanName"
                  placeholder="e.g., Pro Plan"
                  value={formData.ratePlanName}
                  onChange={(e) => updateFormData('ratePlanName', e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Plan Type</Label>
                  <Select value={formData.ratePlanType} onValueChange={(v) => updateFormData('ratePlanType', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="promotional">Promotional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Billing Period</Label>
                  <Select value={formData.billingPeriod} onValueChange={(v) => updateFormData('billingPeriod', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <AIRecommendation
              title="Charge Model Recommendation"
              description="Based on your product type, a tiered pricing model could increase revenue by 15-20% compared to flat fee pricing."
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chargeName">Charge Name *</Label>
                <Input
                  id="chargeName"
                  placeholder="e.g., Monthly Subscription"
                  value={formData.chargeName}
                  onChange={(e) => updateFormData('chargeName', e.target.value)}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Charge Type</Label>
                  <Select value={formData.chargeType} onValueChange={(v) => updateFormData('chargeType', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recurring">Recurring</SelectItem>
                      <SelectItem value="one_time">One-Time</SelectItem>
                      <SelectItem value="usage">Usage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Charge Model</Label>
                  <Select value={formData.chargeModel} onValueChange={(v) => updateFormData('chargeModel', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat_fee">Flat Fee</SelectItem>
                      <SelectItem value="per_unit">Per Unit</SelectItem>
                      <SelectItem value="tiered">Tiered</SelectItem>
                      <SelectItem value="volume">Volume</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.price}
                    onChange={(e) => updateFormData('price', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 className="font-medium">Enable Usage-Based Billing</h4>
                <p className="text-sm text-muted-foreground">Charge customers based on actual usage</p>
              </div>
              <Switch
                checked={formData.usageEnabled}
                onCheckedChange={(v) => updateFormData('usageEnabled', v)}
              />
            </div>
            {formData.usageEnabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label htmlFor="usageUnit">Usage Unit</Label>
                  <Input
                    id="usageUnit"
                    placeholder="e.g., API calls, GB, hours"
                    value={formData.usageUnit}
                    onChange={(e) => updateFormData('usageUnit', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usagePrice">Price per Unit</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="usagePrice"
                      type="number"
                      placeholder="0.00"
                      className="pl-7"
                      value={formData.usagePrice}
                      onChange={(e) => updateFormData('usagePrice', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div>
                <h4 className="font-medium">Enable Discounts</h4>
                <p className="text-sm text-muted-foreground">Configure discount rules for this product</p>
              </div>
              <Switch
                checked={formData.discountEnabled}
                onCheckedChange={(v) => updateFormData('discountEnabled', v)}
              />
            </div>
            {formData.discountEnabled && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={formData.discountType} onValueChange={(v) => updateFormData('discountType', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountValue">Discount Value</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {formData.discountType === 'percentage' ? '%' : '$'}
                    </span>
                    <Input
                      id="discountValue"
                      type="number"
                      placeholder="0"
                      className="pl-7"
                      value={formData.discountValue}
                      onChange={(e) => updateFormData('discountValue', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Catalog Preview</CardTitle>
                <CardDescription>Review your product catalog structure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3 mb-3">
                      <Package className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">{formData.productName || 'Untitled Product'}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{formData.productDescription || 'No description'}</p>
                    
                    <div className="ml-6 space-y-3">
                      <div className="p-3 rounded-lg bg-background border">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard className="h-4 w-4 text-secondary" />
                          <span className="font-medium">{formData.ratePlanName || 'Untitled Plan'}</span>
                          <span className="text-xs text-muted-foreground">({formData.billingPeriod})</span>
                        </div>
                        <div className="ml-6">
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-amber-500" />
                            <span>{formData.chargeName || 'Untitled Charge'}</span>
                            <span className="font-semibold">${formData.price || '0'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6 text-center py-8">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Rocket className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Ready to Deploy</h3>
              <p className="text-muted-foreground">
                Your product catalog is configured and ready to be pushed to Zuora.
              </p>
            </div>
            <Card className="text-left">
              <CardContent className="pt-6">
                <dl className="grid gap-3">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Products</dt>
                    <dd className="font-medium">1</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Rate Plans</dt>
                    <dd className="font-medium">1</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Charges</dt>
                    <dd className="font-medium">1</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Usage Billing</dt>
                    <dd className="font-medium">{formData.usageEnabled ? 'Enabled' : 'Disabled'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Discounts</dt>
                    <dd className="font-medium">{formData.discountEnabled ? 'Enabled' : 'Disabled'}</dd>
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

  const stepIcons = [Package, CreditCard, Zap, BarChart2, Percent, Eye, Rocket];
  const StepIcon = stepIcons[currentStep];

  return (
    <div className="min-h-screen bg-background">
      <Header showSearch={false} />

      <main className="container px-4 py-6 max-w-4xl">
        <Button variant="ghost" className="mb-4 -ml-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Product Catalog Configuration</h1>
          <p className="text-muted-foreground">Define your products, pricing, and billing rules</p>
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
            <Button onClick={handleDeploy} className="bg-green-600 hover:bg-green-700">
              <Rocket className="mr-2 h-4 w-4" />
              Deploy to Zuora
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
