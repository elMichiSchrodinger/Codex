import React, { useState } from 'react';
import { Plus, Download, FileText } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { NonConformity } from '../../types';
import { mockNonConformities } from '../../data/mockData';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export function NonConformities() {
  const [nonConformities, setNonConformities] = useState<NonConformity[]>(mockNonConformities);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NonConformity | null>(null);

  const handleOpenModal = (item?: NonConformity) => {
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (formData: any) => {
    if (selectedItem) {
      setNonConformities(nonConformities.map(nc => 
        nc.id === selectedItem.id ? { ...nc, ...formData } : nc
      ));
    } else {
      const newItem: NonConformity = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      };
      setNonConformities([...nonConformities, newItem]);
    }
    handleCloseModal();
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    let yPosition = 20;

    doc.setFontSize(18);
    doc.text('Non-Conformities Report', 20, yPosition);
    yPosition += 20;

    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
    yPosition += 15;

    nonConformities.forEach((nc, index) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(12);
      doc.text(`${index + 1}. ${nc.description}`, 20, yPosition);
      yPosition += 8;
      
      doc.setFontSize(10);
      doc.text(`Cause: ${nc.cause}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Action: ${nc.action}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Status: ${nc.status} | Severity: ${nc.severity}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Created: ${nc.createdAt.toLocaleDateString()}`, 25, yPosition);
      yPosition += 12;
    });

    doc.save('non-conformities-report.pdf');
  };

  const generateExcelReport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      nonConformities.map(nc => ({
        ID: nc.id,
        Description: nc.description,
        Cause: nc.cause,
        Action: nc.action,
        Status: nc.status,
        Severity: nc.severity,
        'Created Date': nc.createdAt.toLocaleDateString()
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Non-Conformities');
    XLSX.writeFile(workbook, 'non-conformities-report.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Non-Conformities</h1>
        <div className="flex space-x-2">
          <button
            onClick={generatePDFReport}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>PDF Report</span>
          </button>
          <button
            onClick={generateExcelReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Excel Report</span>
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Non-Conformity</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cause
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nonConformities.map((nc) => (
              <tr key={nc.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleOpenModal(nc)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {nc.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {nc.description}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {nc.cause}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {nc.action}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={nc.severity} type="priority" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={nc.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {nc.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <NonConformityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        item={selectedItem}
      />
    </div>
  );
}

interface NonConformityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  item: NonConformity | null;
}

function NonConformityModal({ isOpen, onClose, onSave, item }: NonConformityModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    cause: '',
    action: '',
    severity: 'medium',
    status: 'open'
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        description: item.description,
        cause: item.cause,
        action: item.action,
        severity: item.severity,
        status: item.status
      });
    } else {
      setFormData({
        description: '',
        cause: '',
        action: '',
        severity: 'medium',
        status: 'open'
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Non-Conformity' : 'Add New Non-Conformity'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Root Cause
          </label>
          <textarea
            value={formData.cause}
            onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Corrective Action
          </label>
          <textarea
            value={formData.action}
            onChange={(e) => setFormData({ ...formData, action: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity
            </label>
            <select
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as NonConformity['severity'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as NonConformity['status'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>
          </div>
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
            {item ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}