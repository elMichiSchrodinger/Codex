import React, { useState } from 'react';
import { Plus, Calendar, FileText, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { Audit } from '../../types';
import { mockAudits } from '../../data/mockData';
import jsPDF from 'jspdf';

export function Audits() {
  const { isAdmin } = useAuth();
  const [audits, setAudits] = useState<Audit[]>(mockAudits);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);

  const handleOpenModal = (audit?: Audit) => {
    setSelectedAudit(audit || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAudit(null);
  };

  const handleSave = (formData: any) => {
    if (selectedAudit) {
      setAudits(audits.map(a => 
        a.id === selectedAudit.id ? { ...a, ...formData } : a
      ));
    } else {
      const newAudit: Audit = {
        id: Date.now().toString(),
        ...formData,
        date: new Date(formData.date),
        recommendations: formData.recommendations.split('\n').filter((r: string) => r.trim())
      };
      setAudits([...audits, newAudit]);
    }
    handleCloseModal();
  };

  const generateReport = (audit: Audit) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = 20;

    // Title
    doc.setFontSize(18);
    doc.text('Audit Report', 20, yPosition);
    yPosition += 20;

    // Audit Details
    doc.setFontSize(12);
    doc.text(`Audit Name: ${audit.name}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Scope: ${audit.scope}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Date: ${audit.date.toLocaleDateString()}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Result: ${audit.result.toUpperCase()}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Status: ${audit.status.toUpperCase()}`, 20, yPosition);
    yPosition += 20;

    // Recommendations
    if (audit.recommendations.length > 0) {
      doc.text('Recommendations:', 20, yPosition);
      yPosition += 10;
      
      audit.recommendations.forEach((rec, index) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(`${index + 1}. ${rec}`, 25, yPosition);
        yPosition += 8;
      });
    }

    doc.save(`audit-report-${audit.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Audits</h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Audit</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Audit Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Scope
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {audits.map((audit) => (
              <tr key={audit.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {audit.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {audit.scope}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {audit.date.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={audit.result} type="result" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={audit.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => generateReport(audit)}
                    className="text-green-600 hover:text-green-900 p-1"
                    title="Generate Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleOpenModal(audit)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit Audit"
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AuditModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        audit={selectedAudit}
      />
    </div>
  );
}

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  audit: Audit | null;
}

function AuditModal({ isOpen, onClose, onSave, audit }: AuditModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    scope: '',
    date: '',
    result: 'passed',
    status: 'scheduled',
    recommendations: ''
  });

  React.useEffect(() => {
    if (audit) {
      setFormData({
        name: audit.name,
        scope: audit.scope,
        date: audit.date.toISOString().split('T')[0],
        result: audit.result,
        status: audit.status,
        recommendations: audit.recommendations.join('\n')
      });
    } else {
      setFormData({
        name: '',
        scope: '',
        date: new Date().toISOString().split('T')[0],
        result: 'passed',
        status: 'scheduled',
        recommendations: ''
      });
    }
  }, [audit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={audit ? 'Edit Audit' : 'Schedule New Audit'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Audit Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scope
          </label>
          <textarea
            value={formData.scope}
            onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Result
            </label>
            <select
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value as Audit['result'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="partial">Partial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Audit['status'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recommendations (one per line)
          </label>
          <textarea
            value={formData.recommendations}
            onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Enter each recommendation on a new line"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {audit ? 'Update' : 'Schedule'} Audit
          </button>
        </div>
      </form>
    </Modal>
  );
}