import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { Search, FileText, LogIn, Plus, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function PublicConsulta() {
  const navigate = useNavigate();
  const [numeroSolicitud, setNumeroSolicitud] = useState('');
  const [requisicion, setRequisicion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('consultar');
  
  // Form state for creating requisition
  const [tipoRequisicion, setTipoRequisicion] = useState('compra');
  const [formData, setFormData] = useState({
    requerido_por: '',
    departamento: '',
    prioridad: 'Normal',
    fecha_requerida: '',
    material_descripcion: '',
    cantidad: '',
    unidad_medida: '',
    comentarios: '',
    supervisor_aprobador: '',
    proveedor_sugerido: '',
    recibido_por: '',
    autorizacion_ehs: '',
    // Campos materia prima
    area: '',
    proyecto: '',
    proceso: '',
    main_part: '',
    part_number: '',
    modelo: '',
    descripcion: '',
    color: '',
    cantidad_solicitada: '',
    calidad_solicitada: '',
    referencia: ''
  });

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

  const handleCrearRequisicion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/requisiciones/public`, {
        tipo: tipoRequisicion,
        ...formData
      });

      toast.success(`Requisición ${response.data.numero_solicitud} creada exitosamente`);
      
      // Show the created requisition number
      setNumeroSolicitud(response.data.numero_solicitud);
      setActiveTab('consultar');
      
      // Reset form
      setFormData({
        requerido_por: '',
        departamento: '',
        prioridad: 'Normal',
        fecha_requerida: '',
        material_descripcion: '',
        cantidad: '',
        unidad_medida: '',
        comentarios: '',
        supervisor_aprobador: '',
        proveedor_sugerido: '',
        recibido_por: '',
        autorizacion_ehs: '',
        area: '',
        proyecto: '',
        proceso: '',
        main_part: '',
        part_number: '',
        modelo: '',
        descripcion: '',
        color: '',
        cantidad_solicitada: '',
        calidad_solicitada: '',
        referencia: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al crear requisición');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="consultar" className="text-base" data-testid="tab-consultar">
                <Search className="mr-2 h-5 w-5" />
                Consultar Requisición
              </TabsTrigger>
              <TabsTrigger value="crear" className="text-base" data-testid="tab-crear">
                <Plus className="mr-2 h-5 w-5" />
                Crear Requisición
              </TabsTrigger>
            </TabsList>

            {/* Consultar Tab */}
            <TabsContent value="consultar">
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
            </TabsContent>

            {/* Crear Tab */}
            <TabsContent value="crear">
              <Card className="shadow-xl" data-testid="crear-requisicion-card">
                <CardHeader className="text-center space-y-2">
                  <div className="flex justify-center mb-2">
                    <Plus className="h-12 w-12" style={{ color: '#009E60' }} />
                  </div>
                  <CardTitle className="text-2xl font-bold">Crear Nueva Requisición</CardTitle>
                  <CardDescription className="text-base">
                    Complete el formulario para enviar su solicitud al sistema interno
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCrearRequisicion} className="space-y-6">
                    {/* Tipo de Requisición */}
                    <div className="space-y-2">
                      <Label>Tipo de Requisición</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['compra', 'materia_prima', 'servicios'].map((tipo) => (
                          <div
                            key={tipo}
                            onClick={() => setTipoRequisicion(tipo)}
                            className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                              tipoRequisicion === tipo
                                ? 'border-dre-green bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            data-testid={`tipo-${tipo}-option`}
                          >
                            <p className="font-semibold text-center capitalize text-sm">
                              {tipo === 'materia_prima' ? 'Materia Prima' : tipo}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Información General */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="requerido_por">Nombre Completo *</Label>
                        <Input
                          id="requerido_por"
                          data-testid="requerido-por-input"
                          value={formData.requerido_por}
                          onChange={(e) => handleChange('requerido_por', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email_solicitante">Correo Electrónico *</Label>
                        <Input
                          id="email_solicitante"
                          type="email"
                          data-testid="email-solicitante-input"
                          placeholder="correo@ejemplo.com"
                          value={formData.email_solicitante}
                          onChange={(e) => handleChange('email_solicitante', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="departamento">Departamento *</Label>
                        <Input
                          id="departamento"
                          data-testid="departamento-input"
                          value={formData.departamento}
                          onChange={(e) => handleChange('departamento', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono (Opcional)</Label>
                        <Input
                          id="telefono"
                          type="tel"
                          data-testid="telefono-input"
                          placeholder="(809) 123-4567"
                          value={formData.telefono}
                          onChange={(e) => handleChange('telefono', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supervisor_aprobador">Supervisor/Gerente Aprobador *</Label>
                      <Input
                        id="supervisor_aprobador"
                        data-testid="supervisor-input"
                        value={formData.supervisor_aprobador}
                        onChange={(e) => handleChange('supervisor_aprobador', e.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Prioridad</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={formData.prioridad === 'Normal'}
                              onCheckedChange={() => handleChange('prioridad', 'Normal')}
                            />
                            Normal
                          </label>
                          <label className="flex items-center gap-2">
                            <Checkbox
                              checked={formData.prioridad === 'Alta'}
                              onCheckedChange={() => handleChange('prioridad', 'Alta')}
                            />
                            Alta
                          </label>
                        </div>
                      </div>
                      {formData.prioridad === 'Alta' && (
                        <div className="space-y-2">
                          <Label htmlFor="fecha_requerida">Fecha Requerida *</Label>
                          <Input
                            id="fecha_requerida"
                            type="date"
                            data-testid="fecha-requerida-input"
                            value={formData.fecha_requerida}
                            onChange={(e) => handleChange('fecha_requerida', e.target.value)}
                            required
                          />
                        </div>
                      )}
                    </div>

                    {/* Campos específicos según tipo */}
                    {tipoRequisicion === 'compra' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="material_descripcion">Descripción del Material *</Label>
                          <Input
                            id="material_descripcion"
                            data-testid="material-descripcion-input"
                            value={formData.material_descripcion}
                            onChange={(e) => handleChange('material_descripcion', e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="cantidad">Cantidad *</Label>
                            <Input
                              id="cantidad"
                              type="number"
                              data-testid="cantidad-input"
                              value={formData.cantidad}
                              onChange={(e) => handleChange('cantidad', e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="unidad_medida">Unidad de Medida *</Label>
                            <Input
                              id="unidad_medida"
                              data-testid="unidad-medida-input"
                              value={formData.unidad_medida}
                              onChange={(e) => handleChange('unidad_medida', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="proveedor_sugerido">Proveedor Sugerido</Label>
                          <Input
                            id="proveedor_sugerido"
                            value={formData.proveedor_sugerido}
                            onChange={(e) => handleChange('proveedor_sugerido', e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    {tipoRequisicion === 'materia_prima' && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="area">Área</Label>
                            <Input
                              id="area"
                              value={formData.area}
                              onChange={(e) => handleChange('area', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="proyecto">Proyecto</Label>
                            <Input
                              id="proyecto"
                              value={formData.proyecto}
                              onChange={(e) => handleChange('proyecto', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="part_number">Part Number</Label>
                            <Input
                              id="part_number"
                              value={formData.part_number}
                              onChange={(e) => handleChange('part_number', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="modelo">Modelo</Label>
                            <Input
                              id="modelo"
                              value={formData.modelo}
                              onChange={(e) => handleChange('modelo', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="descripcion">Descripción *</Label>
                          <Input
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => handleChange('descripcion', e.target.value)}
                            required
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="color">Color</Label>
                            <Input
                              id="color"
                              value={formData.color}
                              onChange={(e) => handleChange('color', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cantidad_solicitada">Cantidad Solicitada</Label>
                            <Input
                              id="cantidad_solicitada"
                              type="number"
                              value={formData.cantidad_solicitada}
                              onChange={(e) => handleChange('cantidad_solicitada', e.target.value)}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {tipoRequisicion === 'servicios' && (
                      <div className="space-y-2">
                        <Label htmlFor="material_descripcion">Descripción del Servicio *</Label>
                        <Input
                          id="material_descripcion"
                          value={formData.material_descripcion}
                          onChange={(e) => handleChange('material_descripcion', e.target.value)}
                          required
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="comentarios">Comentarios / Justificación *</Label>
                      <Textarea
                        id="comentarios"
                        data-testid="comentarios-textarea"
                        value={formData.comentarios}
                        onChange={(e) => handleChange('comentarios', e.target.value)}
                        rows={4}
                        placeholder="Indique la justificación de la solicitud..."
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 text-lg font-semibold"
                      style={{ backgroundColor: '#009E60' }}
                      disabled={loading}
                      data-testid="submit-requisicion-button"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Enviar Requisición
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default PublicConsulta;