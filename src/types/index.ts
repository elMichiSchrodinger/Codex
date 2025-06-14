export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'maintenance';
  category: string;
  owner: string;
}

export interface SLA {
  id: string;
  name: string;
  objective: number;
  current: number;
  status: 'healthy' | 'warning' | 'critical';
  service: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  assignee?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Request {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'completed' | 'rejected';
  requester: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Audit {
  id: string;
  name: string;
  scope: string;
  result: 'passed' | 'failed' | 'partial';
  status: 'scheduled' | 'in-progress' | 'completed';
  date: Date;
  recommendations: string[];
}

export interface NonConformity {
  id: string;
  description: string;
  cause: string;
  action: string;
  status: 'open' | 'in-progress' | 'closed';
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface Risk {
  id: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  probability: 'low' | 'medium' | 'high';
  mitigation: string;
  status: 'identified' | 'mitigated' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface Asset {
  id: string;
  name: string;
  type: 'hardware' | 'software' | 'network' | 'data';
  status: 'active' | 'inactive' | 'maintenance' | 'retired';
  linkedServices: string[];
  location?: string;
}

export interface Problem {
  id: string;
  description: string;
  rootCause: string;
  solution: string;
  status: 'identified' | 'investigating' | 'resolved';
  relatedIncidents: string[];
  createdAt: Date;
}

export interface KPI {
  availability: number;
  totalIncidents: number;
  avgResolutionTime: number;
  customerSatisfaction: number;
  slaCompliance: number;
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
}