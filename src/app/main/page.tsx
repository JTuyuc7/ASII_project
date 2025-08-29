'use client';
// import { RegisterForm } from '@/app/auth/register/RegisterForm'
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '../components/auth/login/loginPage';
import { RegisterForm } from '../components/auth/register/registerPage';
import MainLayout from './layout';

export default function MainPage() {
  const { currentView, isAuthenticated } = useAuth();

  const renderContent = () => {
    if (currentView === 'login' && !isAuthenticated) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100dvh',
          }}
        >
          <LoginPage />
        </div>
      );
    }

    if (currentView === 'register' && !isAuthenticated) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <RegisterForm />
        </div>
      );
    }

    // Default main content
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Welcome to our E-commerce Store</h1>
        {isAuthenticated ? (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back! Here's your personalized content.</p>
            {/* Add your authenticated user content here */}
          </div>
        ) : (
          <div>
            <h2>Discover Amazing Products</h2>
            <p>
              Browse our collection or sign up to get personalized
              recommendations.
            </p>
            {/* Add your public content here */}
          </div>
        )}
      </div>
    );
  };

  return <MainLayout>{renderContent()}</MainLayout>;
}
