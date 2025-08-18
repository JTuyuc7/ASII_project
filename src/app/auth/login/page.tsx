import { LoginForm } from './LoginForm';
import { StyleErrorBoundary } from '@/components/StyleErrorBoundary';
import './login.css';

export default function LoginPage() {
  return (
    <StyleErrorBoundary>
      <div className="auth-container">
        <LoginForm />
      </div>
    </StyleErrorBoundary>
  );
}
