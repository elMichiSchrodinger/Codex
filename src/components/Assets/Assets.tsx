import React, { useState } from 'react';
import { Plus, Edit, Link } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../Common/Modal';
import { StatusBadge } from '../Common/StatusBadge';
import { Asset } from '../../types';
import { mockAssets, mockServices } from '../../data/mockData';

export function Assets() {
  const { isAdmin } = useAuth();
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const handleOpenModal = (asset?: Asset) => {
    setSelectedAsset(asset || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const handleSave = (formData: any) => {
    if (selectedAsset) {
      setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, ...formData } : a));
    } else {
      const newAsset: Asset = {
        id: Date.now().toString(),
        ...formData
      };
      setAssets([...assets, newAsset]);
    }
    handleCloseModal();
  };

  const getLinkedServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => {
      const service = mockServices.find(s => s.name === id);
      return service ? service.name : id;
    }).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
        {isAdmin && (
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Asset</span>
          </button>
        )}
      </div>

      {/* Asset Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {['hardware', 'software', 'network', 'data'].map((type) => {
          const count = assets.filter(a => a.type === type).length;
          const activeCount = assets.filter(a => a.type === type && a.status === 'active').length;
          
          return (
            <div key={type} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 capitalize">{type}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                  <p className="text-xs text-gray-500">{activeCount} active</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Link className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asset Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Linked Services
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assets.map((asset) => (
              <tr key={asset.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {asset.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {asset.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={asset.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {asset.location || 'Not specified'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="flex flex-wrap gap-1">
                    {asset.linkedServices.length > 0 ? (
                      asset.linkedServices.map((service, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No linked services</span>
                    )}
                  </div>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenModal(asset)}
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

      <AssetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        asset={selectedAsset}
      />
    </div>
  );
}

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  asset: Asset | null;
}

function AssetModal({ isOpen, onClose, onSave, asset }: AssetModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'hardware',
    status: 'active',
    location: '',
    linkedServices: [] as string[]
  });

  React.useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        type: asset.type,
        status: asset.status,
        location: asset.location || '',
        linkedServices: asset.linkedServices
      });
    } else {
      setFormData({
        name: '',
        type: 'hardware',
        status: 'active',
        location: '',
        linkedServices: []
      });
    }
  }, [asset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      linkedServices: prev.linkedServices.includes(serviceName)
        ? prev.linkedServices.filter(s => s !== serviceName)
        : [...prev.linkedServices, serviceName]
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={asset ? 'Edit Asset' : 'Add New Asset'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Asset Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Asset['type'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
              <option value="data">Data</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Asset['status'] })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Data Center A, Building 1, Virtual Environment"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Linked Services
          </label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {mockServices.map((service) => (
              <label key={service.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.linkedServices.includes(service.name)}
                  onChange={() => handleServiceToggle(service.name)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{service.name}</span>
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
            {asset ? 'Update' : 'Create'} Asset
          </button>
        </div>
      </form>
    </Modal>
  );
}