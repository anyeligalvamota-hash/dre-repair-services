import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Search, FileText, LogIn } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function PublicConsulta() {
  const navigate = useNavigate();
  const [numeroSolicitud, setNumeroSolicitud] = useState('');
  const [requisicion, setRequisicion] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleConsulta = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRequisicion(null);

    try {
      const response = await axios.get(`${API}/requisiciones/public/${numeroSolicitud}`);
      setRequisicion(response.data);
      toast.success('Requisición encontrada');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Requisición no encontrada');
    } finally {
      setLoading(false);
    }
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
    return <Badge className={`${className} px-3 py-1`} data-testid="requisicion-estado-badge">{label}</Badge>;
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, #FFFFFF 0%, #E8F5E9 50%, #F5F5F5 100%)'
    }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-dre-green rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">DRE</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#009E60' }}>DRE Repair Services</h1>
                <p className="text-gray-600">Sistema de Gestión de Requisiciones</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="h-11 px-6 font-semibold"
              style={{ backgroundColor: '#009E60' }}
              data-testid="header-login-button"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Iniciar Sesión
            </Button>
          </div>
        </div>

        {/* Consulta Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl" data-testid="consulta-card">
            <CardHeader className="text-center space-y-2">
              <div className="flex justify-center mb-2">
                <FileText className="h-12 w-12" style={{ color: '#009E60' }} />
              </div>
              <CardTitle className="text-2xl font-bold">Consultar Estado de Requisición</CardTitle>
              <CardDescription className="text-base">
                Ingrese el número de solicitud para consultar el estado de su requisición
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConsulta} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número de Solicitud</Label>
                  <Input
                    id="numero"
                    data-testid="consulta-numero-input"
                    placeholder="Ej: REQ-ABC12345"
                    value={numeroSolicitud}
                    onChange={(e) => setNumeroSolicitud(e.target.value)}
                    required
                    className="h-12 text-lg"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-lg font-semibold"
                  style={{ backgroundColor: '#009E60' }}
                  disabled={loading}
                  data-testid="consulta-submit-button"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Consultar Estado
                    </>
                  )}
                </Button>
              </form>

              {/* Resultado */}
              {requisicion && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl space-y-4 animate-fade-in" data-testid="consulta-resultado">
                  <h3 className="text-xl font-bold" style={{ color: '#009E60' }}>Resultado de la Consulta</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Número de Solicitud</p>
                      <p className="font-semibold text-lg">{requisicion.numero_solicitud}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-semibold capitalize">{requisicion.tipo}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Departamento</p>
                      <p className="font-semibold">{requisicion.departamento}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fecha</p>
                      <p className="font-semibold">{new Date(requisicion.fecha).toLocaleDateString('es-ES')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-2">Estado Actual</p>
                      {getEstadoBadge(requisicion.estado)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PublicConsulta;