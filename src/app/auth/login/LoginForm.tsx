'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { loginAction } from './actions';
import './login.css';

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, setCurrentView } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginAction({ email, password });

      if (result.success && result.token) {
        login(result.token);
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.log(err, 'Error details');
      setError('Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchToRegister = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      setCurrentView('register');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          disabled={loading}
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </form>

      <p>
        ¿No tienes cuenta?{' '}
        <button
          type="button"
          onClick={handleSwitchToRegister}
          className="link-button"
        >
          Crear cuenta
        </button>
      </p>
    </div>
  );
}
