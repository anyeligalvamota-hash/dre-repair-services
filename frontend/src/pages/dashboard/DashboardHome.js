import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { FileText, ShoppingCart, FileCheck, TrendingUp, Plus } from 'lucide-react';

function DashboardHome() {
  const { user, API, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    requisiciones: 0,
    pendientes: 0,
    aprobadas: 0,
    rechazadas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/requisiciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const reqs = response.data;
      setStats({
        requisiciones: reqs.length,
        pendientes: reqs.filter(r => r.estado === 'pendiente' || r.estado === 'cotizaciones_cargadas').length,
        aprobadas: reqs.filter(r => r.estado === 'aprobado').length,
        rechazadas: reqs.filter(r => r.estado === 'rechazado').length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: FileText, label: 'Total Requisiciones', value: stats.requisiciones, color: '#009E60' },
    { icon: ShoppingCart, label: 'Pendientes', value: stats.pendientes, color: '#F59E0B' },
    { icon: FileCheck, label: 'Aprobadas', value: stats.aprobadas, color: '#10B981' },
    { icon: TrendingUp, label: 'Rechazadas', value: stats.rechazadas, color: '#EF4444' }
  ];

  return (
    <div className="p-8" data-testid="dashboard-home">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#009E60' }}>Bienvenido, {user.nombre}</h1>
        <p className="text-gray-600 text-lg">Panel de Control - Sistema de Gestión de Requisiciones</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-dre-green">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#009E60' }}>Crear Nueva Requisición</h2>
                <p className="text-gray-600">Inicia el proceso de solicitud de materiales o servicios</p>
              </div>
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold"
                style={{ backgroundColor: '#009E60' }}
                onClick={() => navigate('/dashboard/requisiciones/crear')}
                data-testid="create-requisicion-button"
              >
                <Plus className="mr-2 h-6 w-6" />
                Nueva Requisición
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="hover:shadow-lg transition-shadow" data-testid={`stat-card-${idx}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.label}</CardTitle>
              <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" style={{ color: stat.color }}>
                {loading ? '...' : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/dashboard/requisiciones')}>
          <CardContent className="p-6">
            <FileText className="h-12 w-12 mb-4" style={{ color: '#009E60' }} />
            <h3 className="text-xl font-bold mb-2">Mis Requisiciones</h3>
            <p className="text-gray-600">Ver y gestionar todas tus requisiciones</p>
          </CardContent>
        </Card>

        {(user.roles.compras || user.roles.admin) && (
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/dashboard/cotizaciones')}>
            <CardContent className="p-6">
              <ShoppingCart className="h-12 w-12 mb-4" style={{ color: '#009E60' }} />
              <h3 className="text-xl font-bold mb-2">Cotizaciones</h3>
              <p className="text-gray-600">Cargar y gestionar cotizaciones</p>
            </CardContent>
          </Card>
        )}

        {(user.roles.compras || user.roles.admin) && (
          <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/dashboard/purchase-documents')}>
            <CardContent className="p-6">
              <FileCheck className="h-12 w-12 mb-4" style={{ color: '#009E60' }} />
              <h3 className="text-xl font-bold mb-2">Purchase Documents</h3>
              <p className="text-gray-600">Gestionar órdenes de compra</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DashboardHome;