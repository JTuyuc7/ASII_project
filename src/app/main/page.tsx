'use client';
// import { RegisterForm } from '@/app/auth/register/RegisterForm'
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '../../components/auth/login/loginPage';
import { RegisterForm } from '../../components/auth/register/registerPage';
import BannerShopPage from '../../components/banner-shop/page';
import CloseProducts from '../../components/close-products/page';
import Footer from '../../components/footer/page';
import OutstandingProducts from '../../components/outstanding-products/page';
import QuickFilters from '../../components/quick-filters/page';
import SellBanner from '../../components/sell-banner/page';
import { customColors } from '../../theme';
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

    return (
      <>
        <div
          style={{
            backgroundColor: customColors.brand[0],
            padding: '2rem',
          }}
        >
          <BannerShopPage />
        </div>

        <div
          style={{
            backgroundColor: customColors.neutral[0],
            //minHeight: '100vh',
          }}
        >
          <QuickFilters />
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            minHeight: '60vh',
          }}
        >
          <OutstandingProducts />
        </div>

        <div
          style={{
            backgroundColor: customColors.neutral[1],
            padding: '2rem 0',
          }}
        >
          <CloseProducts />
        </div>

        <SellBanner />

        <Footer />
      </>
    );
  };

  return <MainLayout>{renderContent()}</MainLayout>;
}
