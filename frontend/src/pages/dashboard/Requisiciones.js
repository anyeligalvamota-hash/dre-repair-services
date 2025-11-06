import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Plus, Search, FileText, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

function Requisiciones() {
  const { API, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requisiciones, setRequisiciones] = useState([]);
  const [filteredReqs, setFilteredReqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');

  useEffect(() => {
    fetchRequisiciones();
  }, []);

  useEffect(() => {
    filterRequisiciones();
  }, [searchTerm, filterEstado, requisiciones]);

  const fetchRequisiciones = async () => {
    try {
      const response = await axios.get(`${API}/requisiciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequisiciones(response.data);
    } catch (error) {
      toast.error('Error al cargar requisiciones');
    } finally {
      setLoading(false);
    }
  };

  const filterRequisiciones = () => {
    let filtered = requisiciones;

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.numero_solicitud.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterEstado !== 'all') {
      filtered = filtered.filter(req => req.estado === filterEstado);
    }

    setFilteredReqs(filtered);
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'pendiente': { label: 'Pendiente', className: 'estado-pendiente' },
      'cotizaciones_cargadas': { label: 'Cotizaciones Cargadas', className: 'estado-cotizacion' },
      'enviado_aprobacion': { label: 'Enviado a Aprobación', className: 'estado-proceso' },
      'aprobado': { label: 'Aprobado', className: 'estado-aprobado' },
      'rechazado': { label: 'Rechazado', className: 'estado-rechazado' },
      'hold': { label: 'En HOLD', className: 'estado-hold' }
    };
    const { label, className } = estados[estado] || estados['pendiente'];
    return <Badge className={`${className} px-3 py-1`}>{label}</Badge>;
  };

  return (
    <div className="p-8" data-testid="requisiciones-page">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#009E60' }}>Requisiciones</h1>
          <p className="text-gray-600 text-lg">Gestiona todas tus solicitudes de materiales y servicios</p>
        </div>
        <Button
          size="lg"
          className="h-12 px-6 font-semibold"
          style={{ backgroundColor: '#009E60' }}
          onClick={() => navigate('/dashboard/requisiciones/crear')}
          data-testid="create-new-requisicion-button"
        >
          <Plus className="mr-2 h-5 w-5" />
          Nueva Requisición
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por número, departamento o solicitante..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
              data-testid="search-requisiciones-input"
            />
          </div>
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="px-4 h-12 border border-gray-300 rounded-lg bg-white"
          data-testid="filter-estado-select"
        >
          <option value="all">Todos los Estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="cotizaciones_cargadas">Cotizaciones Cargadas</option>
          <option value="enviado_aprobacion">Enviado a Aprobación</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
          <option value="hold">En HOLD</option>
        </select>
      </div>

      {/* Requisiciones List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dre-green" />
        </div>
      ) : filteredReqs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">No se encontraron requisiciones</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReqs.map((req) => (
            <Card key={req.id} className="hover:shadow-lg transition-shadow" data-testid={`requisicion-card-${req.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold" style={{ color: '#009E60' }}>
                        {req.numero_solicitud}
                      </h3>
                      {getEstadoBadge(req.estado)}
                      <Badge variant="outline" className="capitalize">{req.tipo}</Badge>
                      {req.prioridad === 'Alta' && (
                        <Badge className="bg-red-100 text-red-800">Alta Prioridad</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Solicitante</p>
                          <p className="font-semibold">{req.solicitante}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Departamento</p>
                          <p className="font-semibold">{req.departamento}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-gray-500">Fecha</p>
                          <p className="font-semibold">
                            {new Date(req.fecha).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    </div>
                    {req.material_descripcion && (
                      <p className="mt-3 text-gray-600">
                        <span className="font-semibold">Descripción: </span>
                        {req.material_descripcion}
                      </p>
                    )}
                    {req.comentario_rechazo && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">
                          <span className="font-semibold">Razón de rechazo: </span>
                          {req.comentario_rechazo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Requisiciones;