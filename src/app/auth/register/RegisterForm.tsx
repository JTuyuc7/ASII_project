'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { registerAction } from './actions';
import './register.css';

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setCurrentView } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const result = await registerAction(formData);

      if (result.success && result.token) {
        login(result.token);
      } else {
        setError(result.error || 'Error al registrar');
      }
    } catch (err) {
      console.log(err, 'Error details');
      setError('Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      setCurrentView('login');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <input
          type="text"
          value={formData.firstName}
          onChange={e =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          placeholder="Nombre"
          required
          disabled={loading}
        />

        <input
          type="text"
          value={formData.lastName}
          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
          placeholder="Apellido"
          required
          disabled={loading}
        />

        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="Correo"
          required
          disabled={loading}
        />

        <input
          type="password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          placeholder="Contraseña"
          required
          disabled={loading}
        />

        <input
          type="password"
          value={formData.confirmPassword}
          onChange={e =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          placeholder="Confirmar contraseña"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p>
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={handleSwitchToLogin}
          className="link-button"
        >
          Iniciar sesión
        </button>
      </p>
    </div>
  );
}
