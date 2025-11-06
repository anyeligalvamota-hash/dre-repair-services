import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

function Register() {
  const { login, API } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    departamento: '',
    esColaborador: true
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        departamento: formData.departamento,
        roles: {
          colaborador: formData.esColaborador,
          visitante: false,
          supervisor: false,
          gerente: false,
          director: false,
          ceo: false,
          compras: false,
          admin: false
        }
      };

      const response = await axios.post(`${API}/auth/register`, payload);
      login(response.data.token, response.data.user);
      toast.success('Registro exitoso');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: 'linear-gradient(135deg, #F5F5F5 0%, #E8F5E9 100%)'
    }}>
      <Card className="w-full max-w-md shadow-xl" data-testid="register-card">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-dre-green rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">DRE</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold" style={{ color: '#009E60' }}>Crear Cuenta</CardTitle>
          <CardDescription className="text-lg">Registrarse en el sistema DRE</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                data-testid="register-nombre-input"
                placeholder="Juan Pérez"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                data-testid="register-email-input"
                placeholder="correo@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                data-testid="register-departamento-input"
                placeholder="Ej: Compras, Producción..."
                value={formData.departamento}
                onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                data-testid="register-password-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="h-11"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="colaborador"
                checked={formData.esColaborador}
                onCheckedChange={(checked) => setFormData({ ...formData, esColaborador: checked })}
              />
              <Label htmlFor="colaborador" className="text-sm">
                Registrar como usuario colaborador interno
              </Label>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-lg font-semibold"
              style={{ backgroundColor: '#009E60' }}
              disabled={loading}
              data-testid="register-submit-button"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <UserPlus className="mr-2 h-5 w-5" />
                  Registrarse
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: '#009E60' }}>
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;