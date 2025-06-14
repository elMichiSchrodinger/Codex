import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { SLA } from '../../types';
import { mockSLAs } from '../../data/mockData';

export function SLAManagement() {
  const { isAdmin } = useAuth();
  const [slas, setSLAs] = useState<SLA[]>(mockSLAs);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSLA, setSelectedSLA] = useState<SLA | null>(null);

  const handleOpenModal = (sla?: SLA) => {
    setSelectedSLA(sla || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSLA(null);
  };

  const handleSaveSLA = (formData: any) => {
    const slaData = {
      ...formData,
      objective: parseFloat(formData.objective),
      current: parseFloat(formData.current),
      status: calculateStatus(parseFloat(formData.current), parseFloat(formData.objective))
    };

    if (selectedSLA) {
      setSLAs(slas.map(s => s.id === selectedSLA.id ? { ...s, ...slaData } : s));
    } else {
      const newSLA: SLA = {
        id: Date.now().toString(),
        ...slaData
      };
      setSLAs([...slas, newSLA]);
    }
    handleCloseModal();
  };

  const calculateStatus = (current: number, objective: number): SLA['status'] => {
    const percentage = (current / objective) * 100;
    if (percentage >= 98) return 'healthy';
    if (percentage >= 90) return 'warning';
    return 'critical';
  };

  const criticalSLAs = slas.filter(sla => sla.status === 'critical');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">SLA Management</h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add SLA</span>
          </button>
        )}
      </div>

      {criticalSLAs.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
            <h3 className="text-lg font-medium text-red-800">Critical SLA Alerts</h3>
          </div>
          <div className="mt-2">
            <p className="text-red-700">
              {criticalSLAs.length} SLA(s) are in critical status and require immediate attention.
            </p>
            <ul className="list-disc list-inside mt-2 text-red-600">
              {criticalSLAs.map(sla => (
                <li key={sla.id}>{sla.name} - Current: {sla.current}% (Target: {sla.objective}%)</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SLA Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Objective
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {slas.map((sla) => (
              <tr key={sla.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {sla.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sla.service}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sla.objective}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sla.current}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={sla.status} />
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(sla)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SLAModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSLA}
        sla={selectedSLA}
      />
    </div>
  );
}

interface SLAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  sla: SLA | null;
}

function SLAModal({ isOpen, onClose, onSave, sla }: SLAModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    objective: '',
    current: ''
  });

  React.useEffect(() => {
    if (sla) {
      setFormData({
        name: sla.name,
        service: sla.service,
        objective: sla.objective.toString(),
        current: sla.current.toString()
      });
    } else {
      setFormData({
        name: '',
        service: '',
        objective: '',
        current: ''
      });
    }
  }, [sla]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={sla ? 'Edit SLA' : 'Add New SLA'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            SLA Name
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
            Associated Service
          </label>
          <input
            type="text"
            value={formData.service}
            onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Objective (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.objective}
            onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Value (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.current}
            onChange={(e) => setFormData({ ...formData, current: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
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
            {sla ? 'Update' : 'Create'} SLA
          </button>
        </div>
      </form>
    </Modal>
  );
}