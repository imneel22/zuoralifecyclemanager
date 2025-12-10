export type HealthStatus = 'green' | 'amber' | 'red';

export type Phase = 'discovery' | 'configuration' | 'migration' | 'testing' | 'golive';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
}

export interface HealthScore {
  overall: number;
  timeline: number;
  quality: number;
  engagement: number;
}

export type BusinessModel = 'subscription' | 'usage' | 'hybrid';

export interface PhaseDate {
  phase: Phase;
  startDate?: string;
  endDate?: string;
  status: 'completed' | 'in_progress' | 'pending';
}

export interface Implementation {
  id: string;
  customerName: string;
  sfdcOpportunityId: string;
  targetGoLive: string;
  currentPhase: Phase;
  healthScore: HealthScore;
  daysToGoLive: number;
  team: TeamMember[];
  industry: string;
  productTypes: string[];
  createdAt: string;
  updatedAt: string;
  arr?: number;
  businessModel?: BusinessModel;
  phaseDates?: PhaseDate[];
  projectDescription?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  assignee: TeamMember;
  dueDate: string;
  phase: Phase;
}

export interface Activity {
  id: string;
  type: 'task_completed' | 'phase_changed' | 'comment' | 'file_uploaded' | 'alert';
  title: string;
  description: string;
  user: TeamMember;
  timestamp: string;
}

export interface MigrationFile {
  id: string;
  name: string;
  type: string;
  size: number;
  status: 'pending' | 'processing' | 'validated' | 'error';
  recordCount?: number;
  errorCount?: number;
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  confidence: number;
  status: 'auto' | 'manual' | 'unmapped';
}

export interface GoLiveMetric {
  label: string;
  value: number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  unit?: string;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  recommendation: string;
  timestamp: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  ratePlans: RatePlan[];
}

export interface RatePlan {
  id: string;
  name: string;
  charges: Charge[];
}

export interface Charge {
  id: string;
  name: string;
  type: 'recurring' | 'one_time' | 'usage';
  model: 'flat_fee' | 'per_unit' | 'tiered' | 'volume';
  price?: number;
}

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}
