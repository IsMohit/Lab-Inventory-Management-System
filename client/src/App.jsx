import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route , Navigate} from "react-router-dom";
import Header from "./components/Header";
import DashboardView from "./pages/DashboardView";
import InventoryView from "./pages/InventoryView";
import NotificationsView from "./pages/NotificationView";
import ComponentModal from "./components/ComponentModal";
import TransactionModal from "./components/TransactionModal";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import { useLocation } from "react-router-dom";
import { sampleComponents } from "./constants/sampleComponents";
import { categories } from "./constants/categories";
import { enhancedChartData, pieColors } from "./constants/chartData";

import "./index.css";

export const LIMS = () => {
  // const [currentView, setCurrentView] = useState("dashboard");
  const location1 = useLocation();
const pathToView = {
  "/": "dashboard",
  "/inventory": "inventory",
  "/notifications": "notifications",
  "/users" : "usermanagement"
};
const [currentView, setCurrentView] = useState(pathToView[location1.pathname] || "dashboard");

  const [components, setComponents] = useState(sampleComponents);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [user, setUser] = useState({
    name: "Dr. Sarah Chen",
    role: "Lab Administrator",
    avatar: "SC",
  });
  const [notifications, setNotifications] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingComponent, setEditingComponent] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState("inward");
  const [transactionComponent, setTransactionComponent] = useState(null);
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  useEffect(() => {
    const newNotifications = [];
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(now.getMonth() - 3);

    components.forEach((component) => {
      if (component.quantity === 0) {
        newNotifications.push({
          id: `critical-${component.id}`,
          type: "critical-stock",
          message: `${component.name} is completely out of stock - immediate action required`,
          component: component.name,
          severity: "critical",
          timestamp: new Date().toISOString(),
        });
      } else if (component.quantity <= component.criticalLowThreshold * 0.5) {
        newNotifications.push({
          id: `urgent-${component.id}`,
          type: "urgent-stock",
          message: `${component.name} is critically low (${component.quantity} remaining)`,
          component: component.name,
          severity: "urgent",
          timestamp: new Date().toISOString(),
        });
      } else if (component.quantity <= component.criticalLowThreshold) {
        newNotifications.push({
          id: `low-${component.id}`,
          type: "low-stock",
          message: `${component.name} stock is below threshold (${component.quantity} remaining)`,
          component: component.name,
          severity: "warning",
          timestamp: new Date().toISOString(),
        });
      }

      const lastUpdated = new Date(component.lastUpdated);
      if (lastUpdated < threeMonthsAgo) {
        newNotifications.push({
          id: `old-${component.id}`,
          type: "old-stock",
          message: `${component.name} has been inactive for over 3 months - consider reviewing`,
          component: component.name,
          severity: "info",
          timestamp: new Date().toISOString(),
        });
      }
    });

    setNotifications(newNotifications);
  }, [components]);

  useEffect(() => {
  setCurrentView(pathToView[location.pathname] || "dashboard");
}, [location.pathname]);


  const filteredComponents = useMemo(() => {
    return components.filter((component) => {
      const matchesSearch =
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.manufacturer
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        component.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Categories" ||
        component.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [components, searchTerm, selectedCategory]);

  const dashboardMetrics = useMemo(() => {
    const totalComponents = components.length;
    const totalValue = components.reduce(
      (sum, comp) => sum + comp.quantity * comp.unitPrice,
      0
    );
    const totalQuantity = components.reduce(
      (sum, comp) => sum + comp.quantity,
      0
    );
    const lowStockItems = components.filter(
      (comp) => comp.quantity <= comp.criticalLowThreshold && comp.quantity > 0
    );
    const criticalStockItems = components.filter(
      (comp) =>
        comp.quantity <= comp.criticalLowThreshold * 0.5 && comp.quantity > 0
    );
    const outOfStockItems = components.filter((comp) => comp.quantity === 0);
    const activeSuppliers = [
      ...new Set(components.map((comp) => comp.supplier)),
    ].length;

    const categoryDistribution = categories
      .slice(1)
      .map((category) => ({
        name: category.split("/")[0].split(" ")[0],
        value: components.filter((comp) => comp.category === category).length,
        fullName: category,
      }))
      .filter((item) => item.value > 0);

    const recentActivity = components
      .sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      .slice(0, 5);

    return {
      totalComponents,
      totalValue,
      totalQuantity,
      lowStockCount: lowStockItems.length,
      criticalStockCount: criticalStockItems.length,
      outOfStockCount: outOfStockItems.length,
      activeSuppliers,
      categoryDistribution,
      recentActivity,
      averageValue: totalValue / totalComponents || 0,
    };
  }, [components]);

  const handleAddComponent = (componentData) => {
    const newComponent = {
      id: Math.max(...components.map((c) => c.id)) + 1,
      ...componentData,
      addedDate: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      status: "active",
    };
    setComponents([...components, newComponent]);
    setShowAddModal(false);
  };

  const handleEditComponent = (componentData) => {
    setComponents(
      components.map((comp) =>
        comp.id === editingComponent.id
          ? {
              ...comp,
              ...componentData,
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : comp
      )
    );
    setShowEditModal(false);
    setEditingComponent(null);
  };

  const handleTransaction = (quantity, reason, project) => {
    const updatedComponents = components.map((comp) => {
      if (comp.id === transactionComponent.id) {
        const newQuantity =
          transactionType === "inward"
            ? comp.quantity + parseInt(quantity)
            : Math.max(0, comp.quantity - parseInt(quantity));
        return {
          ...comp,
          quantity: newQuantity,
          lastUpdated: new Date().toISOString().split("T")[0],
          status:
            newQuantity === 0
              ? "out_of_stock"
              : newQuantity <= comp.criticalLowThreshold
              ? "low_stock"
              : "active",
        };
      }
      return comp;
    });
    setComponents(updatedComponents);
    setShowTransactionModal(false);
    setTransactionComponent(null);
  };

  const deleteComponent = (id) => {
    setComponents(components.filter((comp) => comp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!isLoginPage && (
  <Header 
    user={user} 
    dashboardMetrics={dashboardMetrics} 
    notifications={notifications}
    showMobileMenu={showMobileMenu}
    setShowMobileMenu={setShowMobileMenu}
    setCurrentView={setCurrentView}
    currentView={currentView}
  />
)}


      <div className={!isLoginPage ? "flex" : ""}>
        <main className={!isLoginPage ? "w-full max-w-7xl mx-auto mt-16 p-4" : "w-full"}>
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} /> */}
            <Route path="/" element={
              <DashboardView
                user={user}
                dashboardMetrics={dashboardMetrics}
                components={components}
                pieColors={pieColors}
                enhancedChartData={enhancedChartData}
              />
            } />
            <Route path="/inventory" element={
              <InventoryView
                user={user}
                filteredComponents={filteredComponents}
                setShowAddModal={setShowAddModal}
                setEditingComponent={setEditingComponent}
                setShowEditModal={setShowEditModal}
                setTransactionComponent={setTransactionComponent}
                setTransactionType={setTransactionType}
                setShowTransactionModal={setShowTransactionModal}
                deleteComponent={deleteComponent}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            } />
            <Route path="/notifications" element={<NotificationsView notifications={notifications} />} />
            <Route path="/users" element={
              // <ProtectedRoute role="admin">
                <UserManagement />
              // </ProtectedRoute>
            } />
          </Routes>
        </main>
      </div>

      <ComponentModal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setEditingComponent(null);
        }}
        onSubmit={showEditModal ? handleEditComponent : handleAddComponent}
        component={editingComponent}
        title={showEditModal ? "Edit Component" : "Add New Component"}
      />

      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => {
          setShowTransactionModal(false);
          setTransactionComponent(null);
        }}
        onSubmit={handleTransaction}
        type={transactionType}
        component={transactionComponent}
      />
    </div>
  );
};

export default LIMS;
