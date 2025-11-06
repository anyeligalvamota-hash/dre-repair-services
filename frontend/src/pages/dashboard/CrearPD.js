import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

function CrearPD() {
  const { API, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [dollarRate, setDollarRate] = useState(58.0);

  // Pre-filled data from requisicion and cotizacion
  const prefilledData = location.state || {};

  const [formData, setFormData] = useState({
    requisicion_id: prefilledData.requisicion_id || '',
    cotizacion_id: prefilledData.cotizacion_id || '',
    
    // Información del Producto
    part_numbers: '',
    supplier: prefilledData.proveedor || '',
    siga: '',
    description: prefilledData.descripcion || '',
    uom: '',
    qty: '',
    mpq: '',
    
    // Información de Orden
    po: '',
    po_date: new Date().toISOString().split('T')[0],
    department: prefilledData.departamento || '',
    proyecto: '',
    
    // Precios en RD$
    unit_price_rdp: '',
    itbis_rdp: '',
    dollar_rate: 58.0,
    
    // Control de Inventario
    qty_received: 0,
    
    // Clasificación
    loc_int: 'Local',
    order_status: 'Pendiente pago',
    
    // Aprobación
    approved_by: prefilledData.supervisor_aprobador || '',
    closing_cycle: '',
    
    // Información Financiera
    factura_ncf: '',
    termino_pago: '',
    card: ''
  });

  useEffect(() => {
    fetchDollarRate();
  }, []);

  const fetchDollarRate = async () => {
    try {
      const response = await axios.get(`${API}/exchange-rate`);
      const rate = response.data.rate;
      setDollarRate(rate);
      setFormData(prev => ({ ...prev, dollar_rate: rate }));
    } catch (error) {
      console.error('Error fetching dollar rate:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateNetPriceRDP = () => {
    const unitPrice = parseFloat(formData.unit_price_rdp) || 0;
    const qty = parseFloat(formData.qty) || 0;
    const itbis = parseFloat(formData.itbis_rdp) || 0;
    return (unitPrice * qty) + itbis;
  };

  const calculateUnitPriceUSD = () => {
    const unitPriceRDP = parseFloat(formData.unit_price_rdp) || 0;
    const rate = parseFloat(formData.dollar_rate) || 1;
    return unitPriceRDP / rate;
  };

  const calculateNetPriceUSD = () => {
    const netRDP = calculateNetPriceRDP();
    const rate = parseFloat(formData.dollar_rate) || 1;
    return netRDP / rate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        qty: parseFloat(formData.qty),
        unit_price_rdp: parseFloat(formData.unit_price_rdp),
        itbis_rdp: parseFloat(formData.itbis_rdp),
        dollar_rate: parseFloat(formData.dollar_rate),
        qty_received: parseFloat(formData.qty_received) || 0
      };

      const response = await axios.post(`${API}/purchase-documents`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Purchase Document ${response.data.id} creado exitosamente`);
      navigate('/dashboard/purchase-documents');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al crear Purchase Document');
    } finally {
      setLoading(false);
    }
  };

  const netPriceRDP = calculateNetPriceRDP();
  const unitPriceUSD = calculateUnitPriceUSD();
  const netPriceUSD = calculateNetPriceUSD();

  return (
    <div className="p-8" data-testid="crear-pd-page">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard/purchase-documents')}
            className="mb-4"
            data-testid="back-button"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#009E60' }}>
            Crear Purchase Document
          </h1>
          <p className="text-gray-600 text-lg">Complete todos los campos requeridos</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Información del Producto */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información del Producto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="part_numbers">Part Numbers *</Label>
                  <Input
                    id="part_numbers"
                    value={formData.part_numbers}
                    onChange={(e) => handleChange('part_numbers', e.target.value)}
                    required
                    placeholder="PART-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier *</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => handleChange('supplier', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siga">SIGA *</Label>
                  <Input
                    id="siga"
                    value={formData.siga}
                    onChange={(e) => handleChange('siga', e.target.value)}
                    required
                    placeholder="SIGA-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="uom">UOM (Unidad de Medida) *</Label>
                  <Input
                    id="uom"
                    value={formData.uom}
                    onChange={(e) => handleChange('uom', e.target.value)}
                    required
                    placeholder="Units, Kg, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity (QTY) *</Label>
                  <Input
                    id="qty"
                    type="number"
                    step="0.01"
                    value={formData.qty}
                    onChange={(e) => handleChange('qty', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mpq">MPQ (Minimum Purchase Qty)</Label>
                  <Input
                    id="mpq"
                    value={formData.mpq}
                    onChange={(e) => handleChange('mpq', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Orden */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información de Orden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="po">PO (Purchase Order) *</Label>
                  <Input
                    id="po"
                    value={formData.po}
                    onChange={(e) => handleChange('po', e.target.value)}
                    required
                    placeholder="PO-2025-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="po_date">PO Date *</Label>
                  <Input
                    id="po_date"
                    type="date"
                    value={formData.po_date}
                    onChange={(e) => handleChange('po_date', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="proyecto">Proyecto</Label>
                <Input
                  id="proyecto"
                  value={formData.proyecto}
                  onChange={(e) => handleChange('proyecto', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Precios */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Información de Precios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Precios en RD$ */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h3 className="font-bold text-lg">Precios en Pesos Dominicanos (RD$)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit_price_rdp">Unit Price RD$ *</Label>
                    <Input
                      id="unit_price_rdp"
                      type="number"
                      step="0.01"
                      value={formData.unit_price_rdp}
                      onChange={(e) => handleChange('unit_price_rdp', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="itbis_rdp">ITBIS RD$ *</Label>
                    <Input
                      id="itbis_rdp"
                      type="number"
                      step="0.01"
                      value={formData.itbis_rdp}
                      onChange={(e) => handleChange('itbis_rdp', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Net Price RD$ (Calculado)</Label>
                    <div className="h-10 flex items-center px-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <span className="font-bold text-blue-700">
                        ${netPriceRDP.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dollar Rate */}
              <div className="space-y-2">
                <Label htmlFor="dollar_rate">Dollar Rate (Tasa de Cambio) *</Label>
                <div className="flex gap-2">
                  <Input
                    id="dollar_rate"
                    type="number"
                    step="0.01"
                    value={formData.dollar_rate}
                    onChange={(e) => handleChange('dollar_rate', e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={fetchDollarRate}
                  >
                    <DollarSign className="h-4 w-4" />
                    Actualizar
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Tasa actual: RD$ {dollarRate.toFixed(2)}</p>
              </div>

              {/* Precios en US$ (Calculados) */}
              <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                <h3 className="font-bold text-lg text-blue-700">
                  Precios en Dólares (US$) - Calculados Automáticamente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Unit Price US$ (Calculado)</Label>
                    <div className="h-10 flex items-center px-3 bg-white border border-blue-300 rounded-lg">
                      <span className="font-bold text-blue-700">
                        ${unitPriceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Net Price US$ (Calculado)</Label>
                    <div className="h-10 flex items-center px-3 bg-white border border-blue-300 rounded-lg">
                      <span className="font-bold text-blue-700">
                        ${netPriceUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Control de Inventario y Clasificación */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Control de Inventario y Clasificación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty_received">QTY Received</Label>
                  <Input
                    id="qty_received"
                    type="number"
                    step="0.01"
                    value={formData.qty_received}
                    onChange={(e) => handleChange('qty_received', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loc_int">LOC/INT *</Label>
                  <select
                    id="loc_int"
                    value={formData.loc_int}
                    onChange={(e) => handleChange('loc_int', e.target.value)}
                    className="h-10 w-full px-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="Local">Local</option>
                    <option value="Internacional">Internacional</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_status">Order Status *</Label>
                  <select
                    id="order_status"
                    value={formData.order_status}
                    onChange={(e) => handleChange('order_status', e.target.value)}
                    className="h-10 w-full px-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="Pendiente pago">Pendiente pago</option>
                    <option value="En tránsito">En tránsito</option>
                    <option value="En HOLD">En HOLD</option>
                    <option value="Completado">Completado</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aprobación e Información Financiera */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Aprobación e Información Financiera</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="approved_by">Approved By *</Label>
                  <Input
                    id="approved_by"
                    value={formData.approved_by}
                    onChange={(e) => handleChange('approved_by', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closing_cycle">Closing Cycle</Label>
                  <Input
                    id="closing_cycle"
                    value={formData.closing_cycle}
                    onChange={(e) => handleChange('closing_cycle', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="factura_ncf">Factura (NCF)</Label>
                  <Input
                    id="factura_ncf"
                    value={formData.factura_ncf}
                    onChange={(e) => handleChange('factura_ncf', e.target.value)}
                    placeholder="B0100000001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="termino_pago">Término de Pago</Label>
                  <Input
                    id="termino_pago"
                    value={formData.termino_pago}
                    onChange={(e) => handleChange('termino_pago', e.target.value)}
                    placeholder="30 días, Contado, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card">Card</Label>
                  <Input
                    id="card"
                    value={formData.card}
                    onChange={(e) => handleChange('card', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botones */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/purchase-documents')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              style={{ backgroundColor: '#009E60' }}
              disabled={loading}
              data-testid="submit-pd-button"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Crear Purchase Document
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CrearPD;
