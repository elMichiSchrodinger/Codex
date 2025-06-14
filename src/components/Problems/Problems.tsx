import React, { useState } from 'react';
import { Plus, Edit, Search } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { Problem } from '../../types';
import { mockProblems, mockIncidents } from '../../data/mockData';

export function Problems() {
  const [problems, setProblems] = useState<Problem[]>(mockProblems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const handleOpenModal = (problem?: Problem) => {
    setSelectedProblem(problem || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProblem(null);
  };

  const handleSave = (formData: any) => {
    if (selectedProblem) {
      setProblems(problems.map(p => p.id === selectedProblem.id ? { ...p, ...formData } : p));
    } else {
      const newProblem: Problem = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date(),
        relatedIncidents: formData.relatedIncidents || []
      };
      setProblems([...problems, newProblem]);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Problem Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Problem</span>
        </button>
      </div>

      {/* Problem Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Problems</p>
              <p className="text-2xl font-bold text-gray-900">{problems.length}</p>
            </div>
            <Search className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-2xl font-bold text-yellow-600">
                {problems.filter(p => p.status === 'investigating').length}
              </p>
            </div>
            <Search className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-green-600">
                {problems.filter(p => p.status === 'resolved').length}
              </p>
            </div>
            <Search className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Problem ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Root Cause
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Related Incidents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {problems.map((problem) => (
              <tr key={problem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  PRB{problem.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate">{problem.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="truncate">{problem.rootCause}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={problem.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {problem.relatedIncidents.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {problem.relatedIncidents.map((incidentId, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                        >
                          {incidentId}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {problem.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(problem)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProblemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        problem={selectedProblem}
      />
    </div>
  );
}

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  problem: Problem | null;
}

function ProblemModal({ isOpen, onClose, onSave, problem }: ProblemModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    rootCause: '',
    solution: '',
    status: 'identified',
    relatedIncidents: [] as string[]
  });

  React.useEffect(() => {
    if (problem) {
      setFormData({
        description: problem.description,
        rootCause: problem.rootCause,
        solution: problem.solution,
        status: problem.status,
        relatedIncidents: problem.relatedIncidents
      });
    } else {
      setFormData({
        description: '',
        rootCause: '',
        solution: '',
        status: 'identified',
        relatedIncidents: []
      });
    }
  }, [problem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleIncidentToggle = (incidentId: string) => {
    setFormData(prev => ({
      ...prev,
      relatedIncidents: prev.relatedIncidents.includes(incidentId)
        ? prev.relatedIncidents.filter(id => id !== incidentId)
        : [...prev.relatedIncidents, incidentId]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={problem ? 'Edit Problem' : 'Add New Problem'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Problem Description
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
            Root Cause Analysis
          </label>
          <textarea
            value={formData.rootCause}
            onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Solution
          </label>
          <textarea
            value={formData.solution}
            onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Problem['status'] })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="identified">Identified</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Related Incidents
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
            {mockIncidents.map((incident) => (
              <label key={incident.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.relatedIncidents.includes(incident.id)}
                  onChange={() => handleIncidentToggle(incident.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{incident.id} - {incident.title}</span>
              </label>
            ))}
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
            {problem ? 'Update' : 'Create'} Problem
          </button>
        </div>
      </form>
    </Modal>
  );
}