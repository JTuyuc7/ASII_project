import { LoginForm } from './auth/login/LoginForm';
import './auth/login/login.css';

export default function Home() {
  return (
    <div className="auth-container">
      <div className="auth-content">
        <LoginForm />
      </div>
    </div>
  );
}
