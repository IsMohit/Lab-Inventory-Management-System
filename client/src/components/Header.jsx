import React, { useState, useRef, useEffect } from "react";
import { Bell, Menu, X, Shield, Database, LogOut } from "lucide-react";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({
  user,
  dashboardMetrics,
  notifications,
  showMobileMenu,
  setShowMobileMenu,
  setCurrentView,
  currentView,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Navigation */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  LIMS
                </h1>
                <p className="hidden sm:block text-xs text-gray-500 font-medium">
                  Laboratory Inventory Management
                </p>
              </div>
            </div>
            <div className="hidden lg:block ml-12">
              <Navigation
                user={user}
                isMobile={false}
                notifications={notifications}
                currentView={currentView}
                setCurrentView={setCurrentView}
                setShowMobileMenu={setShowMobileMenu}
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6 px-4 py-2 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {dashboardMetrics?.totalComponents ?? 0}
                </div>
                <div className="text-xs text-gray-500">Components</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  ₹{((dashboardMetrics?.totalValue || 0) / 1000).toFixed(0)}K
                </div>
                <div className="text-xs text-gray-500">Inventory Value</div>
              </div>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrentView("notifications");
                  navigate("/notifications");
                }}
                className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <Bell className="h-6 w-6" />
                {notifications?.length > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium animate-pulse">
                      {notifications.length}
                    </span>
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 animate-ping opacity-75"></span>
                  </>
                )}
              </button>
            </div>

            {/* Profile with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center space-x-3 pl-3 border-l border-gray-200 cursor-pointer"
              >
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center justify-end">
                    <Shield className="h-3 w-3 mr-1" />
                    {user?.role}
                  </div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {user?.avatar}
                </div>
              </div>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-t-xl"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-3 rounded-xl text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="lg:hidden py-6 border-t border-gray-200/50 bg-white/95 backdrop-blur-sm">
            <Navigation
              user={user}
              isMobile
              notifications={notifications}
              currentView={currentView}
              setCurrentView={setCurrentView}
              setShowMobileMenu={setShowMobileMenu}
            />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
