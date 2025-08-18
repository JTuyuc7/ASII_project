import { RegisterForm } from './RegisterForm';
import { StyleErrorBoundary } from '@/components/StyleErrorBoundary';
import './register.css';

export default function RegisterPage() {
  return (
    <StyleErrorBoundary>
      <div className="auth-container register-container">
        <RegisterForm />
      </div>
    </StyleErrorBoundary>
  );
}
