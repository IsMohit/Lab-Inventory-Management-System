  import React, { useState} from 'react';
import { 
  Package, 
  X,
  MapPin,
} from 'lucide-react';
  
  // Enhanced Transaction Modal
  const TransactionModal = ({ isOpen, onClose, component, type, onSubmit }) => {
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [project, setProject] = useState('');

    if (!isOpen || !component) return null;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(quantity, reason, project);
      setQuantity('');
      setReason('');
      setProject('');
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {type === 'inward' ? 'Add Stock' : 'Remove Stock'}
                </h2>
                <p className="text-gray-500 mt-1">
                  {type === 'inward' ? 'Increase inventory levels' : 'Decrease inventory levels'}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Package className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{component.name}</h3>
                  <p className="text-gray-600">{component.partNumber}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-semibold text-gray-700">Current: {component.quantity}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{component.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity to {type === 'inward' ? 'Add' : 'Remove'} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={type === 'outward' ? component.quantity : undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Reason *</label>
                <select
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select reason</option>
                  {type === 'inward' ? (
                    <>
                      <option value="Purchase">New Purchase</option>
                      <option value="Return">Return from Project</option>
                      <option value="Transfer In">Transfer In</option>
                      <option value="Adjustment">Inventory Adjustment</option>
                      <option value="Donation">Donation</option>
                    </>
                  ) : (
                    <>
                      <option value="Project Use">Project Usage</option>
                      <option value="Testing">Testing & Validation</option>
                      <option value="Defective">Defective/Damaged</option>
                      <option value="Transfer Out">Transfer Out</option>
                      <option value="Adjustment">Inventory Adjustment</option>
                      <option value="R&D">Research & Development</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project/Reference</label>
                <input
                  type="text"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                  placeholder="Enter project name or reference ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 text-white rounded-xl transition-all duration-200 font-medium shadow-lg ${
                    type === 'inward' 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                      : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                  }`}
                >
                  {type === 'inward' ? 'Add Stock' : 'Remove Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default TransactionModal;