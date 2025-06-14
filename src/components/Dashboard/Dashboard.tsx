import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Users, X } from 'lucide-react';
import { mockKPIs, slaComplianceData, incidentData } from '../../data/mockData';

export function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('week');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const kpis = [
    {
      title: 'System Availability',
      value: `${mockKPIs.availability}%`,
      change: '+0.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Incidents',
      value: mockKPIs.totalIncidents.toString(),
      change: '-3',
      trend: 'down',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Avg Resolution Time',
      value: `${mockKPIs.avgResolutionTime}h`,
      change: '-0.5h',
      trend: 'down',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Customer Satisfaction',
      value: `${mockKPIs.customerSatisfaction}%`,
      change: '+2%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const alerts = [
    {
      id: '1',
      message: 'Customer satisfaction below 90% threshold',
      type: 'warning',
      severity: 'medium'
    },
    {
      id: '2',
      message: 'Database SLA in critical status',
      type: 'error',
      severity: 'high'
    }
  ].filter(alert => !dismissedAlerts.includes(alert.id));

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">IT Service Management Dashboard</h1>
        <div className="flex space-x-2">
          {['day', 'week', 'month'].map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                timeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 flex items-center justify-between ${
                alert.type === 'error'
                  ? 'bg-red-50 border-red-400 text-red-800'
                  : 'bg-yellow-50 border-yellow-400 text-yellow-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-medium">{alert.message}</span>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 hover:bg-white hover:bg-opacity-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{kpi.value}</p>
                  <p className={`text-sm mt-1 ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.change} from last {timeFilter}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SLA Compliance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={slaComplianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Incidents Resolved by Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* External API Integration Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">External API Integration Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800">Customer Satisfaction API</h4>
            <p className="text-sm text-green-600 mt-1">Last updated: 2 minutes ago</p>
            <p className="text-sm text-green-600">Status: Connected</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800">Response Time Monitoring</h4>
            <p className="text-sm text-blue-600 mt-1">Last updated: 1 minute ago</p>
            <p className="text-sm text-blue-600">Status: Active</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800">Logistics Tracking</h4>
            <p className="text-sm text-yellow-600 mt-1">Last updated: 4 minutes ago</p>
            <p className="text-sm text-yellow-600">Status: Warning</p>
          </div>
        </div>
      </div>
    </div>
  );
}