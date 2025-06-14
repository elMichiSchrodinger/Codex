import { Service, SLA, Incident, Request, Audit, NonConformity, Risk, Asset, Problem, KPI } from '../types';

export const mockServices: Service[] = [
  { id: '1', name: 'Email Service', description: 'Corporate email and communication', status: 'active', category: 'Communication', owner: 'IT Team' },
  { id: '2', name: 'ERP System', description: 'Enterprise resource planning', status: 'active', category: 'Business', owner: 'Business Team' },
  { id: '3', name: 'Database Server', description: 'Main database infrastructure', status: 'maintenance', category: 'Infrastructure', owner: 'DB Team' },
  { id: '4', name: 'Web Portal', description: 'Customer web portal', status: 'active', category: 'Customer Service', owner: 'Web Team' },
];

export const mockSLAs: SLA[] = [
  { id: '1', name: 'Email Availability', objective: 99.9, current: 99.5, status: 'warning', service: 'Email Service' },
  { id: '2', name: 'ERP Response Time', objective: 2.0, current: 1.8, status: 'healthy', service: 'ERP System' },
  { id: '3', name: 'Database Uptime', objective: 99.95, current: 98.2, status: 'critical', service: 'Database Server' },
  { id: '4', name: 'Portal Performance', objective: 3.0, current: 2.5, status: 'healthy', service: 'Web Portal' },
];

export const mockIncidents: Incident[] = [
  {
    id: 'INC001',
    title: 'Email server outage',
    description: 'Main email server is not responding',
    priority: 'high',
    status: 'in-progress',
    assignee: 'John Doe',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00')
  },
  {
    id: 'INC002',
    title: 'Database connection timeout',
    description: 'Users experiencing slow database queries',
    priority: 'medium',
    status: 'open',
    createdAt: new Date('2024-01-14T16:45:00'),
    updatedAt: new Date('2024-01-14T16:45:00')
  }
];

export const mockRequests: Request[] = [
  {
    id: 'REQ001',
    title: 'New user account creation',
    description: 'Create account for new employee',
    priority: 'medium',
    status: 'completed',
    requester: 'HR Department',
    createdAt: new Date('2024-01-10T09:00:00'),
    updatedAt: new Date('2024-01-11T15:30:00')
  },
  {
    id: 'REQ002',
    title: 'Software license renewal',
    description: 'Renew Adobe Creative Suite licenses',
    priority: 'low',
    status: 'in-progress',
    requester: 'Design Team',
    createdAt: new Date('2024-01-12T11:20:00'),
    updatedAt: new Date('2024-01-13T10:15:00')
  }
];

export const mockAudits: Audit[] = [
  {
    id: '1',
    name: 'Security Compliance Audit',
    scope: 'All IT systems and processes',
    result: 'partial',
    status: 'completed',
    date: new Date('2024-01-01'),
    recommendations: ['Implement MFA', 'Update security policies', 'Conduct security training']
  },
  {
    id: '2',
    name: 'ITIL Process Audit',
    scope: 'Incident and Change Management',
    result: 'passed',
    status: 'completed',
    date: new Date('2023-12-15'),
    recommendations: ['Improve documentation', 'Automate reporting']
  }
];

export const mockNonConformities: NonConformity[] = [
  {
    id: '1',
    description: 'Backup procedures not followed',
    cause: 'Lack of automated scheduling',
    action: 'Implement automated backup system',
    status: 'in-progress',
    severity: 'high',
    createdAt: new Date('2024-01-05')
  },
  {
    id: '2',
    description: 'Change management process bypassed',
    cause: 'Emergency deployment without approval',
    action: 'Review emergency procedures',
    status: 'open',
    severity: 'medium',
    createdAt: new Date('2024-01-08')
  }
];

export const mockRisks: Risk[] = [
  {
    id: '1',
    description: 'Data center power failure',
    impact: 'high',
    probability: 'low',
    mitigation: 'Backup generators and UPS systems',
    status: 'mitigated',
    priority: 'high'
  },
  {
    id: '2',
    description: 'Cyber security breach',
    impact: 'high',
    probability: 'medium',
    mitigation: 'Enhanced firewall and monitoring',
    status: 'identified',
    priority: 'critical'
  }
];

export const mockAssets: Asset[] = [
  {
    id: '1',
    name: 'Main Database Server',
    type: 'hardware',
    status: 'active',
    linkedServices: ['ERP System', 'Web Portal'],
    location: 'Data Center A'
  },
  {
    id: '2',
    name: 'Email Server Software',
    type: 'software',
    status: 'active',
    linkedServices: ['Email Service'],
    location: 'Virtual Environment'
  }
];

export const mockProblems: Problem[] = [
  {
    id: '1',
    description: 'Recurring database connectivity issues',
    rootCause: 'Network configuration causing intermittent timeouts',
    solution: 'Update network settings and increase timeout values',
    status: 'resolved',
    relatedIncidents: ['INC002'],
    createdAt: new Date('2024-01-10')
  }
];

export const mockKPIs: KPI = {
  availability: 99.2,
  totalIncidents: 15,
  avgResolutionTime: 4.5,
  customerSatisfaction: 87,
  slaCompliance: 94
};

// Chart data for dashboard
export const slaComplianceData = [
  { name: 'Mon', value: 98 },
  { name: 'Tue', value: 95 },
  { name: 'Wed', value: 97 },
  { name: 'Thu', value: 94 },
  { name: 'Fri', value: 96 },
  { name: 'Sat', value: 99 },
  { name: 'Sun', value: 98 }
];

export const incidentData = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 8 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 10 },
  { name: 'May', value: 6 },
  { name: 'Jun', value: 9 }
];