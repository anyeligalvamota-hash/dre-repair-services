import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Checkbox } from '../../components/ui/checkbox';
import { Download, Users, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

function AdminPanel() {
  const { API, token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRequisiciones: 0
  });
  
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    nombre: '',
    departamento: '',
    roles: {
      colaborador: false,
      supervisor: false,
      gerente: false,
      director: false,
      ceo: false,
      compras: false,
      admin: false
    }
  });

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setStats(prev => ({ ...prev, totalUsers: response.data.length }));
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/requisiciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(prev => ({ ...prev, totalRequisiciones: response.data.length }));
    } catch (error) {
      console.error('Error fetching stats');
    }
  };

  const handleExportRequisiciones = async () => {
    try {
      const response = await axios.get(`${API}/export/requisiciones`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'requisiciones.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Archivo exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar');
    }
  };

  const getRolesBadges = (roles) => {
    const activeRoles = Object.entries(roles)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    
    return activeRoles.map((role, idx) => (
      <Badge key={idx} className="mr-1 mb-1 capitalize" style={{ backgroundColor: '#009E60' }}>
        {role}
      </Badge>
    ));
  };

  return (
    <div className="p-8" data-testid="admin-panel-page">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#009E60' }}>Panel de Administración</h1>
        <p className="text-gray-600 text-lg">Gestión de usuarios y configuración del sistema</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Usuarios</CardTitle>
            <Users className="h-5 w-5" style={{ color: '#009E60' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: '#009E60' }}>
              {stats.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Requisiciones</CardTitle>
            <FileText className="h-5 w-5" style={{ color: '#009E60' }} />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: '#009E60' }}>
              {stats.totalRequisiciones}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Exportar Datos</CardTitle>
            <Download className="h-5 w-5" style={{ color: '#009E60' }} />
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportRequisiciones}
              className="w-full"
              style={{ backgroundColor: '#009E60' }}
              data-testid="export-requisiciones-button"
            >
              <Download className="mr-2 h-4 w-4" />
              Exportar Requisiciones
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dre-green" />
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  data-testid={`user-card-${user.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-dre-green rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">{user.nombre.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-bold text-lg">{user.nombre}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      {user.departamento && (
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-semibold">Departamento:</span> {user.departamento}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1">
                        {getRolesBadges(user.roles)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPanel;