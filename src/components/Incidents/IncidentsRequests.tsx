import React, { useState } from 'react';
import { Plus, Edit, CheckCircle, Clock } from 'lucide-react';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { Incident, Request } from '../../types';
import { mockIncidents, mockRequests } from '../../data/mockData';

export function IncidentsRequests() {
  const [activeTab, setActiveTab] = useState<'incidents' | 'requests'>('incidents');
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [requests, setRequests] = useState<Request[]>(mockRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Incident | Request | null>(null);

  const handleOpenModal = (item?: Incident | Request) => {
    setSelectedItem(item || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSave = (formData: any) => {
    const timestamp = new Date();
    
    if (activeTab === 'incidents') {
      if (selectedItem) {
        setIncidents(incidents.map(i => 
          i.id === selectedItem.id 
            ? { ...i, ...formData, updatedAt: timestamp }
            : i
        ));
      } else {
        const newIncident: Incident = {
          id: `INC${String(incidents.length + 1).padStart(3, '0')}`,
          ...formData,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        setIncidents([...incidents, newIncident]);
      }
    } else {
      if (selectedItem) {
        setRequests(requests.map(r => 
          r.id === selectedItem.id 
            ? { ...r, ...formData, updatedAt: timestamp }
            : r
        ));
      } else {
        const newRequest: Request = {
          id: `REQ${String(requests.length + 1).padStart(3, '0')}`,
          ...formData,
          createdAt: timestamp,
          updatedAt: timestamp
        };
        setRequests([...requests, newRequest]);
      }
    }
    handleCloseModal();
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    const timestamp = new Date();
    if (activeTab === 'incidents') {
      setIncidents(incidents.map(i => 
        i.id === id 
          ? { ...i, status: newStatus as Incident['status'], updatedAt: timestamp }
          : i
      ));
    } else {
      setRequests(requests.map(r => 
        r.id === id 
          ? { ...r, status: newStatus as Request['status'], updatedAt: timestamp }
          : r
      ));
    }
  };

  const currentData = activeTab === 'incidents' ? incidents : requests;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Incidents & Requests</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add {activeTab === 'incidents' ? 'Incident' : 'Request'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('incidents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'incidents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Incidents ({incidents.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Requests ({requests.length})
          </button>
        </nav>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {activeTab === 'incidents' ? 'Assignee' : 'Requester'}
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
            {currentData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.id}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={item.priority} type="priority" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {activeTab === 'incidents' 
                    ? (item as Incident).assignee || 'Unassigned'
                    : (item as Request).requester
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.createdAt.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {item.status !== 'closed' && item.status !== 'resolved' && item.status !== 'completed' && (
                    <button
                      onClick={() => handleStatusChange(
                        item.id, 
                        activeTab === 'incidents' ? 'resolved' : 'completed'
                      )}
                      className="text-green-600 hover:text-green-900 p-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ItemModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        item={selectedItem}
        type={activeTab}
      />
    </div>
  );
}

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  item: Incident | Request | null;
  type: 'incidents' | 'requests';
}

function ItemModal({ isOpen, onClose, onSave, item, type }: ItemModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'open',
    assignee: '',
    requester: ''
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        priority: item.priority,
        status: item.status,
        assignee: type === 'incidents' ? (item as Incident).assignee || '' : '',
        requester: type === 'requests' ? (item as Request).requester : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'open',
        assignee: '',
        requester: ''
      });
    }
  }, [item, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const statusOptions = type === 'incidents' 
    ? ['open', 'in-progress', 'resolved', 'closed']
    : ['open', 'in-progress', 'completed', 'rejected'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? `Edit ${type.slice(0, -1)}` : `Add New ${type.slice(0, -1)}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {type === 'incidents' ? 'Assignee' : 'Requester'}
          </label>
          <input
            type="text"
            value={type === 'incidents' ? formData.assignee : formData.requester}
            onChange={(e) => setFormData({ 
              ...formData, 
              [type === 'incidents' ? 'assignee' : 'requester']: e.target.value 
            })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            {item ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}