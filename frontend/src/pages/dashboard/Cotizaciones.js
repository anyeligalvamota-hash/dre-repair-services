import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Plus, Send, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '../../components/ui/textarea';

function Cotizaciones() {
  const { API, token, user } = useContext(AuthContext);
  const [requisiciones, setRequisiciones] = useState([]);
  const [selectedReq, setSelectedReq] = useState(null);
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRechazarDialog, setOpenRechazarDialog] = useState(false);
  const [selectedCotizacion, setSelectedCotizacion] = useState(null);
  const [comentarioRechazo, setComentarioRechazo] = useState('');

  const [formCotizacion, setFormCotizacion] = useState({
    numero_cotizacion: '',
    proveedor: '',
    monto_rdp: '',
    monto_usd: '',
    descripcion: ''
  });

  useEffect(() => {
    fetchRequisiciones();
  }, []);

  const fetchRequisiciones = async () => {
    try {
      const response = await axios.get(`${API}/requisiciones`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequisiciones(response.data);
    } catch (error) {
      toast.error('Error al cargar requisiciones');
    }
  };

  const fetchCotizaciones = async (reqId) => {
    try {
      const response = await axios.get(`${API}/cotizaciones/requisicion/${reqId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCotizaciones(response.data);
    } catch (error) {
      toast.error('Error al cargar cotizaciones');
    }
  };

  const handleSelectReq = (req) => {
    setSelectedReq(req);
    fetchCotizaciones(req.id);
  };

  const handleCrearCotizacion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API}/cotizaciones`,
        {
          requisicion_id: selectedReq.id,
          ...formCotizacion,
          monto_rdp: parseFloat(formCotizacion.monto_rdp),
          monto_usd: parseFloat(formCotizacion.monto_usd)
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Cotización cargada exitosamente');
      setOpenDialog(false);
      setFormCotizacion({
        numero_cotizacion: '',
        proveedor: '',
        monto_rdp: '',
        monto_usd: '',
        descripcion: ''
      });
      fetchCotizaciones(selectedReq.id);
      fetchRequisiciones();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al cargar cotización');
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarAprobacion = async (reqId) => {
    try {
      await axios.post(
        `${API}/cotizaciones/enviar-aprobacion/${reqId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Enviado a aprobación exitosamente');
      fetchRequisiciones();
      if (selectedReq) {
        const updatedReq = { ...selectedReq, estado: 'enviado_aprobacion' };
        setSelectedReq(updatedReq);
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al enviar a aprobación');
    }
  };

  const handleAprobar = async (cotId) => {
    try {
      await axios.post(
        `${API}/cotizaciones/aprobar/${cotId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Cotización aprobada');
      fetchCotizaciones(selectedReq.id);
      fetchRequisiciones();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al aprobar');
    }
  };

  const handleRechazar = async () => {
    try {
      await axios.post(
        `${API}/cotizaciones/rechazar/${selectedCotizacion.id}`,
        comentarioRechazo,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success('Cotización rechazada');
      setOpenRechazarDialog(false);
      setComentarioRechazo('');
      fetchCotizaciones(selectedReq.id);
      fetchRequisiciones();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al rechazar');
    }
  };

  const puedeCargarCotizaciones = user.roles.compras || user.roles.admin;
  const puedeAprobar = user.roles.supervisor || user.roles.gerente || user.roles.director || user.roles.ceo || user.roles.admin;

  return (
    <div className="p-8" data-testid="cotizaciones-page">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#009E60' }}>Gestión de Cotizaciones</h1>
        <p className="text-gray-600 text-lg">Cargar y gestionar cotizaciones para requisiciones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Requisiciones */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Requisiciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
            {requisiciones.filter(r => r.estado !== 'rechazado').map((req) => (
              <div
                key={req.id}
                onClick={() => handleSelectReq(req)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedReq?.id === req.id
                    ? 'border-dre-green bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                data-testid={`requisicion-item-${req.id}`}
              >
                <p className="font-semibold">{req.numero_solicitud}</p>
                <p className="text-sm text-gray-600">{req.departamento}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge className="text-xs">{req.cotizaciones_count} cotizaciones</Badge>
                  <Badge
                    className={`text-xs ${
                      req.estado === 'aprobado' ? 'estado-aprobado' :
                      req.estado === 'enviado_aprobacion' ? 'estado-proceso' :
                      'estado-pendiente'
                    }`}
                  >
                    {req.estado}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Detalle y Cotizaciones */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {selectedReq ? `Cotizaciones - ${selectedReq.numero_solicitud}` : 'Seleccione una requisición'}
              </CardTitle>
              {selectedReq && puedeCargarCotizaciones && (
                <div className="flex gap-2">
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" style={{ backgroundColor: '#009E60' }} data-testid="add-cotizacion-button">
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar Cotización
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Nueva Cotización</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCrearCotizacion} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Número de Cotización</Label>
                          <Input
                            value={formCotizacion.numero_cotizacion}
                            onChange={(e) => setFormCotizacion({...formCotizacion, numero_cotizacion: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Proveedor</Label>
                          <Input
                            value={formCotizacion.proveedor}
                            onChange={(e) => setFormCotizacion({...formCotizacion, proveedor: e.target.value})}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Monto RD$</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formCotizacion.monto_rdp}
                              onChange={(e) => setFormCotizacion({...formCotizacion, monto_rdp: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Monto US$</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={formCotizacion.monto_usd}
                              onChange={(e) => setFormCotizacion({...formCotizacion, monto_usd: e.target.value})}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Descripción</Label>
                          <Input
                            value={formCotizacion.descripcion}
                            onChange={(e) => setFormCotizacion({...formCotizacion, descripcion: e.target.value})}
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" style={{ backgroundColor: '#009E60' }} disabled={loading}>
                          {loading ? 'Cargando...' : 'Guardar Cotización'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  {selectedReq.cotizaciones_count >= 3 && selectedReq.estado === 'cotizaciones_cargadas' && (
                    <Button
                      size="sm"
                      onClick={() => handleEnviarAprobacion(selectedReq.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                      data-testid="enviar-aprobacion-button"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Enviar a Aprobación
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!selectedReq ? (
              <div className="text-center py-12 text-gray-500">
                Seleccione una requisición para ver sus cotizaciones
              </div>
            ) : cotizaciones.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No hay cotizaciones cargadas
              </div>
            ) : (
              <div className="space-y-4">
                {cotizaciones.map((cot, idx) => (
                  <Card key={cot.id} className="border-2" data-testid={`cotizacion-card-${idx}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-lg">Cotización #{idx + 1}</h4>
                            {cot.aprobada && <Badge className="estado-aprobado">Aprobada</Badge>}
                            {cot.rechazada && <Badge className="estado-rechazado">Rechazada</Badge>}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Número</p>
                              <p className="font-semibold">{cot.numero_cotizacion}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Proveedor</p>
                              <p className="font-semibold">{cot.proveedor}</p>
                            </div>
                            {!user.roles.colaborador && (
                              <>
                                <div>
                                  <p className="text-gray-600">Monto RD$</p>
                                  <p className="font-semibold">${cot.monto_rdp.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600">Monto US$</p>
                                  <p className="font-semibold">${cot.monto_usd.toLocaleString()}</p>
                                </div>
                              </>
                            )}
                            <div className="col-span-2">
                              <p className="text-gray-600">Descripción</p>
                              <p className="font-semibold">{cot.descripcion}</p>
                            </div>
                          </div>
                        </div>
                        {puedeAprobar && !cot.aprobada && !cot.rechazada && selectedReq.estado === 'enviado_aprobacion' && (
                          <div className="flex gap-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => handleAprobar(cot.id)}
                              className="bg-green-600 hover:bg-green-700"
                              data-testid="aprobar-button"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedCotizacion(cot);
                                setOpenRechazarDialog(true);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                              data-testid="rechazar-button"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Rechazar */}
      <Dialog open={openRechazarDialog} onOpenChange={setOpenRechazarDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Cotización</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Comentario de Rechazo</Label>
              <Textarea
                value={comentarioRechazo}
                onChange={(e) => setComentarioRechazo(e.target.value)}
                placeholder="Indique la razón del rechazo..."
                rows={4}
                required
              />
            </div>
            <Button
              onClick={handleRechazar}
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={!comentarioRechazo}
            >
              Confirmar Rechazo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Cotizaciones;