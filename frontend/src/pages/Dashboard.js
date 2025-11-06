import React, { useContext } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import {
  LayoutDashboard,
  FileText,
  ShoppingCart,
  FileCheck,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import DashboardHome from './dashboard/DashboardHome';
import Requisiciones from './dashboard/Requisiciones';
import CrearRequisicion from './dashboard/CrearRequisicion';
import Cotizaciones from './dashboard/Cotizaciones';
import PurchaseDocuments from './dashboard/PurchaseDocuments';
import AdminPanel from './dashboard/AdminPanel';

function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/dashboard', roles: ['all'] },
    { icon: FileText, label: 'Requisiciones', path: '/dashboard/requisiciones', roles: ['all'] },
    { icon: ShoppingCart, label: 'Cotizaciones', path: '/dashboard/cotizaciones', roles: ['compras', 'admin', 'supervisor', 'gerente', 'director', 'ceo'] },
    { icon: FileCheck, label: 'Purchase Documents', path: '/dashboard/purchase-documents', roles: ['compras', 'admin'] },
    { icon: Users, label: 'Administración', path: '/dashboard/admin', roles: ['admin'] }
  ];

  const canAccessMenuItem = (menuRoles) => {
    if (menuRoles.includes('all')) return true;
    return menuRoles.some(role => user.roles[role]);
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
        data-testid="dashboard-sidebar"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-dre-green rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-white">DRE</span>
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#009E60' }}>DRE Repair</p>
                  <p className="text-xs text-gray-500">Services</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="sidebar-toggle-button"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-dre-green rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{user.nombre.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.nombre}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.filter(item => canAccessMenuItem(item.roles)).map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              data-testid={`menu-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-dre-green text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={logout}
            data-testid="logout-button"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {sidebarOpen && <span>Cerrar Sesión</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/requisiciones" element={<Requisiciones />} />
          <Route path="/requisiciones/crear" element={<CrearRequisicion />} />
          <Route path="/cotizaciones" element={<Cotizaciones />} />
          <Route path="/purchase-documents" element={<PurchaseDocuments />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;