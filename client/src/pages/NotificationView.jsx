import {  
  Plus, 
  Bell, 
  Package, 
  AlertTriangle, 
  Clock, 
  Settings,
  X,
  Download,
} from 'lucide-react';



// Enhanced Notifications View
  const NotificationsView = ({ notifications }) => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                <Bell className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">System Notifications</h2>
                <p className="text-gray-600 mt-1">Stay updated with inventory alerts and system updates</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{notifications.length}</div>
              <div className="text-sm text-gray-500">Active Alerts</div>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {notifications.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-6 bg-green-50 rounded-2xl inline-block mb-4">
                <Bell className="mx-auto h-16 w-16 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                No notifications at this time. Your inventory is running smoothly. Check back later for updates.
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System Status: Healthy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Last Check: Just now</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <div className="space-y-6">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`p-6 rounded-2xl border-l-4 transition-all duration-200 hover:shadow-md ${
                    notification.severity === 'critical'
                      ? 'bg-red-50 border-red-500'
                      : notification.severity === 'urgent'
                      ? 'bg-orange-50 border-orange-500'
                      : notification.severity === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-xl ${
                          notification.severity === 'critical'
                            ? 'bg-red-100'
                            : notification.severity === 'urgent'
                            ? 'bg-orange-100'
                            : notification.severity === 'warning'
                            ? 'bg-yellow-100'
                            : 'bg-blue-100'
                        }`}>
                          {notification.type === 'low-stock' || notification.type === 'urgent-stock' || notification.type === 'critical-stock' ? (
                            <AlertTriangle className={`h-6 w-6 ${
                              notification.severity === 'critical'
                                ? 'text-red-600'
                                : notification.severity === 'urgent'
                                ? 'text-orange-600'
                                : notification.severity === 'warning'
                                ? 'text-yellow-600'
                                : 'text-blue-600'
                            }`} />
                          ) : (
                            <Clock className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className={`text-lg font-bold ${
                              notification.severity === 'critical'
                                ? 'text-red-900'
                                : notification.severity === 'urgent'
                                ? 'text-orange-900'
                                : notification.severity === 'warning'
                                ? 'text-yellow-900'
                                : 'text-blue-900'
                            }`}>
                              {notification.type === 'critical-stock' ? 'Critical Stock Alert' :
                               notification.type === 'urgent-stock' ? 'Urgent Stock Alert' :
                               notification.type === 'low-stock' ? 'Low Stock Alert' : 'Inactive Inventory Alert'}
                            </h3>
                            <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${
                              notification.severity === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : notification.severity === 'urgent'
                                ? 'bg-orange-100 text-orange-800'
                                : notification.severity === 'warning'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {notification.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-gray-700 text-lg mb-3">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Package className="h-4 w-4" />
                              <span className="font-medium">{notification.component}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Just now</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );

  export default NotificationsView