import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  MapPin,
} from "lucide-react";
import { categories } from "../constants/categories";

// Enhanced Inventory View
const InventoryView = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  filteredComponents,
  user,
  setShowAddModal,
  setTransactionComponent,
  setTransactionType,
  setShowTransactionModal,
  setEditingComponent,
  setShowEditModal,
  deleteComponent,
}) => (
  <div className="space-y-8">
    {/* Enhanced Search and Filter Bar */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search components, part numbers, manufacturers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-lg"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 min-w-[200px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Component</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">
              {filteredComponents.length}
            </div>
            <div className="text-sm text-gray-600">Components Found</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">
              ₹
              {filteredComponents
                .reduce((sum, comp) => sum + comp.quantity * comp.unitPrice, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">
              {
                filteredComponents.filter(
                  (comp) => comp.quantity <= comp.criticalLowThreshold
                ).length
              }
            </div>
            <div className="text-sm text-gray-600">Low Stock</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-50 rounded-xl">
            <div className="text-2xl font-bold text-red-600">
              {filteredComponents.filter((comp) => comp.quantity === 0).length}
            </div>
            <div className="text-sm text-gray-600">Out of Stock</div>
          </div>
        </div>
      </div>
    </div>

    {/* Enhanced Components Table */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Component Details
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Stock Information
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Location & Supplier
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Financial
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-6 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredComponents.map((component, index) => (
              <tr
                key={component.id}
                className={`hover:bg-gray-50 transition-all duration-200 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                }`}
              >
                <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <Package className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900 mb-1">
                        {component.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {component.partNumber}
                      </div>
                      <div className="text-xs text-gray-500">
                        {component.manufacturer}
                      </div>
                      <div className="text-xs text-gray-400 mt-2 max-w-xs truncate">
                        {component.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-gray-900">
                      {component.quantity.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      Min: {component.criticalLowThreshold}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          component.quantity === 0
                            ? "bg-red-500"
                            : component.quantity <=
                              component.criticalLowThreshold
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            (component.quantity /
                              (component.criticalLowThreshold * 2)) *
                              100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <MapPin size={14} className="mr-2 text-gray-400" />
                      {component.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      {component.supplier}
                    </div>
                    <div className="text-xs text-gray-500">
                      Updated: {component.lastUpdated}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{component.unitPrice.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">per unit</div>
                    <div className="text-sm font-medium text-green-600">
                      Total: ₹
                      {(
                        component.quantity * component.unitPrice
                      ).toLocaleString()}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                  <span
                    className={`inline-flex px-3 py-2 text-sm font-bold rounded-full shadow-sm ${
                      component.quantity === 0
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : component.quantity <= component.criticalLowThreshold
                        ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                        : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {component.quantity === 0
                      ? "Out of Stock"
                      : component.quantity <= component.criticalLowThreshold
                      ? "Low Stock"
                      : "In Stock"}
                  </span>
                </td>
                <td className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-6">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setTransactionComponent(component);
                        setTransactionType("inward");
                        setShowTransactionModal(true);
                      }}
                      className="p-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-xl transition-all duration-200 group"
                      title="Add Stock"
                    >
                      <TrendingUp
                        size={18}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setTransactionComponent(component);
                        setTransactionType("outward");
                        setShowTransactionModal(true);
                      }}
                      className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove Stock"
                      disabled={component.quantity === 0}
                    >
                      <TrendingDown
                        size={18}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setEditingComponent(component);
                        setShowEditModal(true);
                      }}
                      className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      title="Edit Component"
                    >
                      <Edit3
                        size={18}
                        className="group-hover:scale-110 transition-transform duration-200"
                      />
                    </button>
                    
                    {user.role === "Lab Administrator" && (
                      <button
                        onClick={() => deleteComponent(component.id)}
                        className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                        title="Delete Component"
                      >
                        <Trash2
                          size={18}
                          className="group-hover:scale-110 transition-transform duration-200"
                        />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-16">
          <div className="p-6 bg-gray-50 rounded-2xl inline-block mb-4">
            <Package className="mx-auto h-16 w-16 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No components found
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            We couldn't find any components matching your search criteria. Try
            adjusting your filters or add a new component to get started.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
          >
            <Plus size={20} />
            <span>Add First Component</span>
          </button>
        </div>
      )}
    </div>
  </div>
);

export default InventoryView;
