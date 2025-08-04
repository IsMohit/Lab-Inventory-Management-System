import { Bell, BarChart3, Package, ChevronRight, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navigation = ({ user = {}, isMobile = false, notifications = [], currentView, setCurrentView, setShowMobileMenu }) => {
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview & Analytics' },
    { id: 'inventory', label: 'Inventory', icon: Package, description: 'Component Management' },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: notifications.length, description: 'System Notifications' },
  ];

  // Add User Management tab only for admins
  if (user?.role === 'admin') {
    tabs.push({
      id: 'usermanagement',
      label: 'Users',
      icon: Users,
      description: 'Manage Users',
    });
  }

  return (
    <nav className={`${isMobile ? 'flex flex-col space-y-1' : 'flex space-x-1'}`}>
      {tabs.map(({ id, label, icon: Icon, badge, description }) => (
        <button
          key={id}
          onClick={() => {
            setCurrentView(id);
            setShowMobileMenu(false);
            navigate(
              id === 'dashboard' ? '/' :
              id === 'inventory' ? '/inventory' :
              id === 'notifications' ? '/notifications' :
              id === 'usermanagement' ? '/users' : '/'
            );
          }}
          className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
            currentView === id
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Icon size={20} className={currentView === id ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'} />
          <div className="flex-1 text-left">
            <div className={`text-sm font-medium ${currentView === id ? 'text-white' : 'text-gray-900'}`}>
              {label}
            </div>
            {!isMobile && (
              <div className={`text-xs ${currentView === id ? 'text-indigo-100' : 'text-gray-500'}`}>
                {description}
              </div>
            )}
          </div>
          {badge > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium shadow-lg">
              {badge}
            </span>
          )}
          {currentView === id && (
            <ChevronRight size={16} className="text-white" />
          )}
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
