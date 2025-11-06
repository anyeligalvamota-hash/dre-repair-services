import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

function CrearRequisicion() {
  const { API, token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [tipoRequisicion, setTipoRequisicion] = useState('compra');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    departamento: user.departamento || '',
    prioridad: 'Normal',
    fecha_requerida: '',
    material_descripcion: '',
    cantidad: '',
    unidad_medida: '',
    comentarios: '',
    supervisor_aprobador: '',
    supervisor_email: '',
    proveedor_sugerido: '',
    recibido_por: '',
    autorizacion_ehs: '',
    // Campos materia prima
    requerido_por: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        tipo: tipoRequisicion,
        ...formData
      };

      const response = await axios.post(
        `${API}/requisiciones`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Requisición ${response.data.numero_solicitud} creada exitosamente`);
      navigate('/dashboard/requisiciones');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al crear requisición');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8" data-testid="crear-requisicion-page">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/requisiciones')}
            className="mb-4"
            data-testid="back-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#009E60' }}>Nueva Requisición</h1>
          <p className="text-gray-600 text-lg">Complete el formulario según el tipo de requisición</p>
        </div>

        {/* Tipo de Requisición */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipo de Requisición</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['compra', 'materia_prima', 'servicios'].map((tipo) => (
                <div
                  key={tipo}
                  onClick={() => setTipoRequisicion(tipo)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    tipoRequisicion === tipo
                      ? 'border-dre-green bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  data-testid={`tipo-${tipo}-option`}
                >
                  <p className="font-semibold text-center capitalize">
                    {tipo === 'materia_prima' ? 'Materia Prima' : tipo}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supervisor_aprobador">Nombre Supervisor/Gerente *</Label>
                    <Input
                      id="supervisor_aprobador"
                      data-testid="supervisor-input"
                      placeholder="Ej: Carlos Pérez"
                      value={formData.supervisor_aprobador}
                      onChange={(e) => handleChange('supervisor_aprobador', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supervisor_email">Email Supervisor/Gerente *</Label>
                    <Input
                      id="supervisor_email"
                      type="email"
                      data-testid="supervisor-email-input"
                      placeholder="supervisor@dre.com"
                      value={formData.supervisor_email}
                      onChange={(e) => handleChange('supervisor_email', e.target.value)}
                      required
                    />
                  </div>
                </div>
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
                      <Label htmlFor="requerido_por">Requerido Por</Label>
                      <Input
                        id="requerido_por"
                        value={formData.requerido_por}
                        onChange={(e) => handleChange('requerido_por', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area</Label>
                      <Input
                        id="area"
                        value={formData.area}
                        onChange={(e) => handleChange('area', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="proyecto">Proyecto</Label>
                      <Input
                        id="proyecto"
                        value={formData.proyecto}
                        onChange={(e) => handleChange('proyecto', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="proceso">Proceso</Label>
                      <Input
                        id="proceso"
                        value={formData.proceso}
                        onChange={(e) => handleChange('proceso', e.target.value)}
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
                <>
                  <div className="space-y-2">
                    <Label htmlFor="material_descripcion">Descripción del Servicio *</Label>
                    <Input
                      id="material_descripcion"
                      value={formData.material_descripcion}
                      onChange={(e) => handleChange('material_descripcion', e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="comentarios">Comentarios / Justificación *</Label>
                <Textarea
                  id="comentarios"
                  data-testid="comentarios-textarea"
                  value={formData.comentarios}
                  onChange={(e) => handleChange('comentarios', e.target.value)}
                  rows={4}
                  placeholder="Indique la justificación de la compra..."
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard/requisiciones')}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  style={{ backgroundColor: '#009E60' }}
                  disabled={loading}
                  data-testid="submit-requisicion-button"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Crear Requisición
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default CrearRequisicion;