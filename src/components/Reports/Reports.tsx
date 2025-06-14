import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart } from 'lucide-react';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { mockKPIs, mockIncidents, mockSLAs, mockServices } from '../../data/mockData';

export function Reports() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['availability', 'incidents']);
  const [period, setPeriod] = useState('month');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const availableMetrics = [
    { id: 'availability', label: 'System Availability', value: `${mockKPIs.availability}%` },
    { id: 'incidents', label: 'Total Incidents', value: mockKPIs.totalIncidents.toString() },
    { id: 'resolution', label: 'Avg Resolution Time', value: `${mockKPIs.avgResolutionTime}h` },
    { id: 'satisfaction', label: 'Customer Satisfaction', value: `${mockKPIs.customerSatisfaction}%` },
    { id: 'sla', label: 'SLA Compliance', value: `${mockKPIs.slaCompliance}%` },
    { id: 'services', label: 'Active Services', value: mockServices.filter(s => s.status === 'active').length.toString() }
  ];

  const handleMetricToggle = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    const reportData = availableMetrics.filter(metric => 
      selectedMetrics.includes(metric.id)
    );

    if (format === 'pdf') {
      generatePDFReport(reportData);
    } else {
      generateExcelReport(reportData);
    }

    setIsGenerating(false);
  };

  const generatePDFReport = (data: any[]) => {
    const doc = new jsPDF();
    let yPosition = 20;

    // Header
    doc.setFontSize(20);
    doc.text('IT Service Management Report', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.text(`Period: ${period.toUpperCase()}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 20;

    // Metrics
    doc.setFontSize(16);
    doc.text('Key Performance Indicators', 20, yPosition);
    yPosition += 15;

    data.forEach((metric) => {
      doc.setFontSize(12);
      doc.text(`${metric.label}: ${metric.value}`, 30, yPosition);
      yPosition += 10;
    });

    yPosition += 10;

    // Additional sections
    doc.setFontSize(16);
    doc.text('Incident Summary', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    const openIncidents = mockIncidents.filter(i => i.status === 'open').length;
    const inProgressIncidents = mockIncidents.filter(i => i.status === 'in-progress').length;
    const resolvedIncidents = mockIncidents.filter(i => i.status === 'resolved').length;

    doc.text(`Open Incidents: ${openIncidents}`, 30, yPosition);
    yPosition += 8;
    doc.text(`In Progress: ${inProgressIncidents}`, 30, yPosition);
    yPosition += 8;
    doc.text(`Resolved: ${resolvedIncidents}`, 30, yPosition);
    yPosition += 15;

    // SLA Status
    doc.setFontSize(16);
    doc.text('SLA Status Summary', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    const healthySLAs = mockSLAs.filter(sla => sla.status === 'healthy').length;
    const warningSLAs = mockSLAs.filter(sla => sla.status === 'warning').length;
    const criticalSLAs = mockSLAs.filter(sla => sla.status === 'critical').length;

    doc.text(`Healthy SLAs: ${healthySLAs}`, 30, yPosition);
    yPosition += 8;
    doc.text(`Warning SLAs: ${warningSLAs}`, 30, yPosition);
    yPosition += 8;
    doc.text(`Critical SLAs: ${criticalSLAs}`, 30, yPosition);

    doc.save(`itsm-report-${period}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateExcelReport = (data: any[]) => {
    const workbook = XLSX.utils.book_new();

    // KPIs Sheet
    const kpiData = data.map(metric => ({
      Metric: metric.label,
      Value: metric.value,
      Period: period.toUpperCase(),
      'Generated Date': new Date().toLocaleDateString()
    }));

    const kpiSheet = XLSX.utils.json_to_sheet(kpiData);
    XLSX.utils.book_append_sheet(workbook, kpiSheet, 'KPIs');

    // Incidents Sheet
    const incidentData = mockIncidents.map(incident => ({
      ID: incident.id,
      Title: incident.title,
      Priority: incident.priority,
      Status: incident.status,
      Assignee: incident.assignee || 'Unassigned',
      'Created Date': incident.createdAt.toLocaleDateString(),
      'Updated Date': incident.updatedAt.toLocaleDateString()
    }));

    const incidentSheet = XLSX.utils.json_to_sheet(incidentData);
    XLSX.utils.book_append_sheet(workbook, incidentSheet, 'Incidents');

    // SLAs Sheet
    const slaData = mockSLAs.map(sla => ({
      Name: sla.name,
      Service: sla.service,
      'Objective (%)': sla.objective,
      'Current (%)': sla.current,
      Status: sla.status
    }));

    const slaSheet = XLSX.utils.json_to_sheet(slaData);
    XLSX.utils.book_append_sheet(workbook, slaSheet, 'SLAs');

    XLSX.writeFile(workbook, `itsm-report-${period}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Custom Reports</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <BarChart className="w-4 h-4" />
          <span>Generate comprehensive IT service reports</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h2>
          
          {/* Metrics Selection */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Select Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              {availableMetrics.map((metric) => (
                <label key={metric.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedMetrics.includes(metric.id)}
                    onChange={() => handleMetricToggle(metric.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{metric.label}</div>
                    <div className="text-sm text-gray-500">Current: {metric.value}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Period Selection */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Report Period</h3>
            <div className="flex space-x-3">
              {['day', 'week', 'month', 'quarter', 'year'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    period === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">Export Format</h3>
            <div className="flex space-x-3">
              <button
                onClick={() => setFormat('pdf')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  format === 'pdf'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => setFormat('excel')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  format === 'excel'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Download className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Generation Button */}
          <button
            onClick={generateReport}
            disabled={selectedMetrics.length === 0 || isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Period: {period.toUpperCase()}</span>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Selected Metrics ({selectedMetrics.length})</h4>
              {selectedMetrics.length > 0 ? (
                <ul className="space-y-2">
                  {selectedMetrics.map(metricId => {
                    const metric = availableMetrics.find(m => m.id === metricId);
                    return (
                      <li key={metricId} className="flex justify-between text-sm">
                        <span className="text-gray-600">{metric?.label}</span>
                        <span className="font-medium text-gray-900">{metric?.value}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No metrics selected</p>
              )}
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Export Format</h4>
              <div className="flex items-center space-x-2">
                {format === 'pdf' ? (
                  <FileText className="w-4 h-4 text-red-600" />
                ) : (
                  <Download className="w-4 h-4 text-green-600" />
                )}
                <span className="text-sm text-gray-600 capitalize">{format}</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Additional Data</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Incident summaries</li>
                <li>• SLA status overview</li>
                <li>• Service availability data</li>
                <li>• Performance trending</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}