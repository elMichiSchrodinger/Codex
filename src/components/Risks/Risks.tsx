import React, { useState } from 'react';
import { Plus, Edit, AlertTriangle } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { AIInsights } from '../Chatbot/AIInsights';
import { Risk } from '../../types';
import { mockRisks } from '../../data/mockData';

export function Risks() {
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  const handleOpenModal = (risk?: Risk) => {
    setSelectedRisk(risk || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRisk(null);
  };

  const handleSave = (formData: any) => {
    const riskData = {
      ...formData,
      priority: calculatePriority(formData.impact, formData.probability)
    };

    if (selectedRisk) {
      setRisks(risks.map(r => r.id === selectedRisk.id ? { ...r, ...riskData } : r));
    } else {
      const newRisk: Risk = {
        id: Date.now().toString(),
        ...riskData
      };
      setRisks([...risks, newRisk]);
    }
    handleCloseModal();
  };

  const calculatePriority = (impact: string, probability: string): Risk['priority'] => {
    const impactScore = impact === 'high' ? 3 : impact === 'medium' ? 2 : 1;
    const probScore = probability === 'high' ? 3 : probability === 'medium' ? 2 : 1;
    const total = impactScore + probScore;
    
    if (total >= 5) return 'critical';
    if (total >= 4) return 'high';
    if (total >= 3) return 'medium';
    return 'low';
  };

  const getRiskMatrix = () => {
    const matrix = {
      critical: risks.filter(r => r.priority === 'critical').length,
      high: risks.filter(r => r.priority === 'high').length,
      medium: risks.filter(r => r.priority === 'medium').length,
      low: risks.filter(r => r.priority === 'low').length
    };
    return matrix;
  };

  const riskMatrix = getRiskMatrix();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Risk</span>
        </button>
      </div>

      {/* Risk Matrix Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critical</p>
              <p className="text-2xl font-bold text-red-900">{riskMatrix.critical}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">High</p>
              <p className="text-2xl font-bold text-orange-900">{riskMatrix.high}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Medium</p>
              <p className="text-2xl font-bold text-yellow-900">{riskMatrix.medium}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Low</p>
              <p className="text-2xl font-bold text-green-900">{riskMatrix.low}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Risks Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Probability
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
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
            {risks.map((risk) => (
              <React.Fragment key={risk.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{risk.description}</div>
                      <div className="text-sm text-gray-500 mt-1">Mitigation: {risk.mitigation}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={risk.impact} type="priority" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={risk.probability} type="priority" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={risk.priority} type="priority" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={risk.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(risk)}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                {/* AI Insights Row for high priority risks */}
                {(risk.priority === 'critical' || risk.priority === 'high') && (
                  <tr>
                    <td colSpan={6} className="px-6 py-2">
                      <AIInsights data={risk} type="risk" />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <RiskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        risk={selectedRisk}
      />
    </div>
  );
}

interface RiskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  risk: Risk | null;
}

function RiskModal({ isOpen, onClose, onSave, risk }: RiskModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    impact: 'medium',
    probability: 'medium',
    mitigation: '',
    status: 'identified'
  });

  React.useEffect(() => {
    if (risk) {
      setFormData({
        description: risk.description,
        impact: risk.impact,
        probability: risk.probability,
        mitigation: risk.mitigation,
        status: risk.status
      });
    } else {
      setFormData({
        description: '',
        impact: 'medium',
        probability: 'medium',
        mitigation: '',
        status: 'identified'
      });
    }
  }, [risk]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={risk ? 'Edit Risk' : 'Add New Risk'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Risk Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Impact Level
            </label>
            <select
              value={formData.impact}
              onChange={(e) => setFormData({ ...formData, impact: e.target.value as Risk['impact'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Probability
            </label>
            <select
              value={formData.probability}
              onChange={(e) => setFormData({ ...formData, probability: e.target.value as Risk['probability'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mitigation Strategy
          </label>
          <textarea
            value={formData.mitigation}
            onChange={(e) => setFormData({ ...formData, mitigation: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Risk['status'] })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="identified">Identified</option>
            <option value="mitigated">Mitigated</option>
            <option value="closed">Closed</option>
          </select>
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
            {risk ? 'Update' : 'Create'} Risk
          </button>
        </div>
      </form>
    </Modal>
  );
}