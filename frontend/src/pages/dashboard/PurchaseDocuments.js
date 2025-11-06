import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../App';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

function PurchaseDocuments() {
  const { API, token } = useContext(AuthContext);
  const [pds, setPds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPDs();
  }, []);

  const fetchPDs = async () => {
    try {
      const response = await axios.get(`${API}/purchase-documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPds(response.data);
    } catch (error) {
      toast.error('Error al cargar Purchase Documents');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get(`${API}/export/purchase-documents`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'purchase_documents.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Archivo exportado exitosamente');
    } catch (error) {
      toast.error('Error al exportar');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'Pendiente pago': 'estado-pendiente',
      'En tránsito': 'estado-proceso',
      'En HOLD': 'estado-hold',
      'Completado': 'estado-aprobado'
    };
    return <Badge className={statusMap[status] || 'estado-pendiente'}>{status}</Badge>;
  };

  return (
    <div className="p-8" data-testid="purchase-documents-page">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#009E60' }}>Purchase Documents</h1>
          <p className="text-gray-600 text-lg">Gestión de órdenes de compra y seguimiento</p>
        </div>
        <Button
          onClick={handleExport}
          className="h-12 px-6 font-semibold"
          style={{ backgroundColor: '#009E60' }}
          data-testid="export-pds-button"
        >
          <Download className="mr-2 h-5 w-5" />
          Exportar a Excel
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dre-green" />
        </div>
      ) : pds.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-xl text-gray-600">No hay Purchase Documents registrados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pds.map((pd) => (
            <Card key={pd.id} className="hover:shadow-lg transition-shadow" data-testid={`pd-card-${pd.id}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl" style={{ color: '#009E60' }}>{pd.id}</CardTitle>
                  {getStatusBadge(pd.order_status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Supplier</p>
                    <p className="font-semibold">{pd.supplier}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">PO</p>
                    <p className="font-semibold">{pd.po}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="font-semibold">{pd.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">PO Date</p>
                    <p className="font-semibold">{new Date(pd.po_date).toLocaleDateString('es-ES')}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">QTY</p>
                    <p className="font-semibold">{pd.qty}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Unit Price RD$</p>
                    <p className="font-semibold">${pd.unit_price_rdp.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Net Price RD$</p>
                    <p className="font-semibold">${pd.net_price_rdp.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Net Price US$</p>
                    <p className="font-semibold">${pd.net_price_usd.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">QTY Received</p>
                    <p className="font-semibold">{pd.qty_received}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">QTY Pending</p>
                    <p className="font-semibold text-orange-600">{pd.qty_pending}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Dollar Rate</p>
                    <p className="font-semibold">${pd.dollar_rate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Approved By</p>
                    <p className="font-semibold">{pd.approved_by}</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Description</p>
                  <p className="font-semibold">{pd.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PurchaseDocuments;