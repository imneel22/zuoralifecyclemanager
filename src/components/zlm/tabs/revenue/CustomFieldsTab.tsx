import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Layers, RefreshCw, ChevronDown, TrendingUp, Clock, Database } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FieldValue {
  name: string;
  count: number;
  color: string;
}

interface CustomField {
  id: string;
  name: string;
  object: string;
  includeInInference: boolean;
  topValues: FieldValue[];
}

interface ObjectGroup {
  name: string;
  fields: CustomField[];
}

const mockFieldData: ObjectGroup[] = [
  {
    name: 'product',
    fields: [
      {
        id: '1',
        name: 'productfamily__c',
        object: 'product',
        includeInInference: false,
        topValues: [
          { name: 'OEM API', count: 1, color: 'bg-blue-500' },
        ],
      },
    ],
  },
  {
    name: 'productrateplan',
    fields: [
      {
        id: '2',
        name: 'productcategory__c',
        object: 'productrateplan',
        includeInInference: false,
        topValues: [
          { name: 'Add On', count: 312, color: 'bg-blue-500' },
          { name: 'License', count: 79, color: 'bg-green-500' },
          { name: 'Professional Services', count: 11, color: 'bg-yellow-500' },
          { name: 'Usage Tier', count: 9, color: 'bg-red-500' },
        ],
      },
      {
        id: '3',
        name: 'productcode__c',
        object: 'productrateplan',
        includeInInference: false,
        topValues: [
          { name: 'APIBand', count: 13, color: 'bg-blue-500' },
          { name: 'SurveyGizmo Services', count: 8, color: 'bg-green-500' },
          { name: 'SFDC', count: 8, color: 'bg-yellow-500' },
          { name: 'PrivDomain', count: 8, color: 'bg-orange-500' },
          { name: 'Email', count: 7, color: 'bg-amber-500' },
        ],
      },
      {
        id: '4',
        name: 'productfamily__c',
        object: 'productrateplan',
        includeInInference: false,
        topValues: [
          { name: 'Subscriptions', count: 339, color: 'bg-blue-500' },
          { name: 'Training', count: 33, color: 'bg-green-500' },
          { name: 'Professional Services', count: 28, color: 'bg-yellow-500' },
          { name: 'Panel', count: 11, color: 'bg-red-500' },
        ],
      },
      {
        id: '5',
        name: 'viewablebydiv__c',
        object: 'productrateplan',
        includeInInference: false,
        topValues: [
          { name: 'False', count: 229, color: 'bg-blue-500' },
          { name: 'True', count: 182, color: 'bg-green-500' },
        ],
      },
      {
        id: '6',
        name: 'viewablebypartner__c',
        object: 'productrateplan',
        includeInInference: false,
        topValues: [
          { name: 'True', count: 299, color: 'bg-green-500' },
          { name: 'False', count: 112, color: 'bg-red-500' },
        ],
      },
      {
        id: '7',
        name: 'viewablebyteam__c',
        object: 'productrateplan',
        includeInInference: false,
        topValues: [
          { name: 'True', count: 338, color: 'bg-green-500' },
          { name: 'False', count: 73, color: 'bg-blue-500' },
        ],
      },
    ],
  },
  {
    name: 'productrateplancharg',
    fields: [
      {
        id: '8',
        name: 'chargecategory__c',
        object: 'productrateplancharg',
        includeInInference: false,
        topValues: [
          { name: 'Standard', count: 245, color: 'bg-blue-500' },
          { name: 'Premium', count: 89, color: 'bg-green-500' },
          { name: 'Enterprise', count: 34, color: 'bg-yellow-500' },
        ],
      },
      {
        id: '9',
        name: 'revenuerecognition__c',
        object: 'productrateplancharg',
        includeInInference: false,
        topValues: [
          { name: 'Ratable', count: 198, color: 'bg-blue-500' },
          { name: 'Upfront', count: 112, color: 'bg-green-500' },
          { name: 'As Delivered', count: 58, color: 'bg-yellow-500' },
        ],
      },
      {
        id: '10',
        name: 'billingfrequency__c',
        object: 'productrateplancharg',
        includeInInference: false,
        topValues: [
          { name: 'Annual', count: 267, color: 'bg-blue-500' },
          { name: 'Monthly', count: 89, color: 'bg-green-500' },
          { name: 'One-Time', count: 12, color: 'bg-yellow-500' },
        ],
      },
    ],
  },
];

const distributionData = [
  { name: 'productrateplan', count: 6, color: 'bg-blue-500' },
  { name: 'productrateplancharg', count: 3, color: 'bg-green-500' },
  { name: 'product', count: 1, color: 'bg-yellow-500' },
];

export function CustomFieldsTab() {
  const [openSections, setOpenSections] = useState<string[]>(['product', 'productrateplan']);
  const [fieldStates, setFieldStates] = useState<Record<string, boolean>>({});

  const toggleSection = (name: string) => {
    setOpenSections(prev => 
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const toggleInference = (fieldId: string) => {
    setFieldStates(prev => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const totalFields = mockFieldData.reduce((acc, group) => acc + group.fields.length, 0);
  const maxCount = Math.max(...distributionData.map(d => d.count));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Custom Fields</h2>
        <Button variant="ghost" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards Row 1 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <div className="text-3xl font-bold text-blue-600">{mockFieldData.length}</div>
                <p className="text-sm text-muted-foreground">Tables with Custom Fields</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Layers className="h-5 w-5 text-purple-600 mt-1" />
              <div>
                <div className="text-3xl font-bold text-purple-600">{totalFields}</div>
                <p className="text-sm text-muted-foreground">Total Custom Fields</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3 mb-4">
              <TrendingUp className="h-5 w-5 text-primary mt-1" />
              <div>
                <p className="font-medium">Custom Fields by Table</p>
                <p className="text-xs text-muted-foreground">Distribution across tables</p>
              </div>
            </div>
            <div className="space-y-2">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="text-xs w-32 truncate">{item.name}</span>
                  <div className="flex-1 h-5 bg-muted rounded overflow-hidden">
                    <div 
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {Object.values(fieldStates).filter(Boolean).length}
                </div>
                <p className="text-sm text-muted-foreground">Selected for Inference</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-1" />
              <div>
                <div className="text-3xl font-bold text-amber-600">0</div>
                <p className="text-sm text-muted-foreground">Pending Changes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Object Groups */}
      <div className="space-y-4">
        {mockFieldData.map((group) => (
          <Collapsible 
            key={group.name} 
            open={openSections.includes(group.name)}
            onOpenChange={() => toggleSection(group.name)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-primary rounded-full" />
                      <div>
                        <CardTitle className="text-base font-semibold">{group.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {group.fields.length} custom field{group.fields.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {openSections.includes(group.name) ? 'Collapse' : 'Expand'}
                      </span>
                      <ChevronDown className={`h-5 w-5 transition-transform ${openSections.includes(group.name) ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {group.fields.map((field) => {
                      const maxValue = Math.max(...field.topValues.map(v => v.count));
                      const totalValues = field.topValues.reduce((acc, v) => acc + v.count, 0);
                      
                      return (
                        <Card key={field.id} className="border shadow-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <p className="font-semibold text-sm">{field.name}</p>
                                <p className="text-xs text-muted-foreground">{field.object}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Switch 
                                  checked={fieldStates[field.id] || false}
                                  onCheckedChange={() => toggleInference(field.id)}
                                  className="scale-75"
                                />
                                <span className="text-[10px] text-muted-foreground text-right leading-tight">
                                  Include in<br />Product Type<br />Inference
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Top Values & Counts</p>
                              <div className="space-y-1.5">
                                {field.topValues.slice(0, 5).map((value, idx) => (
                                  <div key={idx} className="flex items-center gap-2">
                                    <span className="text-xs w-20 truncate" title={value.name}>
                                      {value.name}
                                    </span>
                                    <div className="flex-1 h-4 bg-muted rounded overflow-hidden">
                                      <div 
                                        className={`h-full ${value.color} transition-all`}
                                        style={{ width: `${(value.count / maxValue) * 100}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium w-8 text-right">{value.count}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t">
                                {field.topValues.slice(0, 3).map((value, idx) => (
                                  <span key={idx} className="text-[10px] text-muted-foreground">
                                    {value.name}: {value.count}
                                    {idx < Math.min(2, field.topValues.length - 1) && ' · '}
                                  </span>
                                ))}
                                {field.topValues.length > 3 && (
                                  <span className="text-[10px] text-primary">
                                    +{field.topValues.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
