import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { Service } from '../../types';
import { mockServices } from '../../data/mockData';

export function ServiceCatalog() {
  const { isAdmin } = useAuth();
  const [services, setServices] = useState<Service[]>(mockServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);

  const handleOpenModal = (service?: Service, viewMode = false) => {
    setSelectedService(service || null);
    setIsViewMode(viewMode);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
    setIsViewMode(false);
  };

  const handleSaveService = (formData: any) => {
    if (selectedService) {
      // Edit existing
      setServices(services.map(s => s.id === selectedService.id ? { ...s, ...formData } : s));
    } else {
      // Add new
      const newService: Service = {
        id: Date.now().toString(),
        ...formData
      };
      setServices([...services, newService]);
    }
    handleCloseModal();
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== serviceId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Service Catalog</h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={service.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {service.owner}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenModal(service, true)}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleOpenModal(service)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveService}
        service={selectedService}
        isViewMode={isViewMode}
        isAdmin={isAdmin}
      />
    </div>
  );
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  service: Service | null;
  isViewMode: boolean;
  isAdmin: boolean;
}

function ServiceModal({ isOpen, onClose, onSave, service, isViewMode, isAdmin }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    category: '',
    owner: ''
  });

  React.useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description,
        status: service.status,
        category: service.category,
        owner: service.owner
      });
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active',
        category: '',
        owner: ''
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isViewMode ? 'Service Details' : service ? 'Edit Service' : 'Add New Service'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isViewMode}
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
            disabled={isViewMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isViewMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Owner
          </label>
          <input
            type="text"
            value={formData.owner}
            onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isViewMode}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Service['status'] })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isViewMode}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        {!isViewMode && isAdmin && (
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
              {service ? 'Update' : 'Create'} Service
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}