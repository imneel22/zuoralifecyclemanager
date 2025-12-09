import { Package, CreditCard, Zap, FileCode, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { AIRecommendation } from '../AIRecommendation';

const configItems = [
  {
    id: 'products',
    title: 'Product Catalog',
    description: 'Define products, rate plans, and charges',
    icon: Package,
    progress: 75,
    status: 'in_progress',
  },
  {
    id: 'billing',
    title: 'Billing Settings',
    description: 'Configure billing rules and invoice templates',
    icon: CreditCard,
    progress: 100,
    status: 'completed',
  },
  {
    id: 'payments',
    title: 'Payment Gateway',
    description: 'Set up payment processing integrations',
    icon: Zap,
    progress: 100,
    status: 'completed',
  },
  {
    id: 'workflows',
    title: 'Workflows',
    description: 'Configure automated workflows and notifications',
    icon: FileCode,
    progress: 30,
    status: 'in_progress',
  },
];

export function ConfigurationTab() {
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-700">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <AIRecommendation
        title="Configuration Suggestion"
        description="Based on the Technology industry, I recommend enabling usage-based billing in your product catalog. 78% of similar implementations use this feature."
        onAccept={() => navigate('/product-catalog')}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {configItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.id} className="group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                      <CardDescription className="text-sm">{item.description}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{item.progress}%</span>
                  </div>
                  <Progress value={item.progress} className="h-2" />
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 group-hover:border-primary group-hover:text-primary"
                    onClick={() => item.id === 'products' && navigate('/product-catalog')}
                  >
                    {item.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Review Configuration
                      </>
                    ) : (
                      <>
                        Continue Setup
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
