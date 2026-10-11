import React, { Suspense, lazy, useState, useEffect } from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import { WelcomePage } from './features/auth/components/WelcomePage';
import { AuthPage } from './features/auth/components/AuthPage';
import { BrandLogo } from './components/common/BrandLogo';
import { AdminAuthService } from './features/auth/services/authService';

const BusinessLayout = lazy(() =>
  import('./components/business/BusinessLayout').then((m) => ({
    default: m.BusinessLayout,
  }))
);

const CreatorLayout = lazy(() =>
  import('./components/creator/CreatorLayout').then((m) => ({
    default: m.CreatorLayout,
  }))
);

const SuperAdminLayout = lazy(() =>
  import('./components/admin/SuperAdminLayout').then((m) => ({
    default: m.SuperAdminLayout,
  }))
);

const AdminLoginPage = lazy(() =>
  import('./components/admin/AdminLoginPage').then((m) => ({
    default: m.AdminLoginPage,
  }))
);

const AccessDeniedPage = lazy(() =>
  import('./components/admin/AccessDeniedPage').then((m) => ({
    default: m.AccessDeniedPage,
  }))
);

const AppLoadingScreen: React.FC = () => (
  <div className="h-screen w-full bg-[#09090b] flex flex-col items-center justify-center space-y-4">
    <div className="animate-pulse">
      <BrandLogo size="lg" iconOnly />
    </div>
    <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
      <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
      <span>Loading CreatorOS workspace...</span>
    </div>
  </div>
);

const MainApp: React.FC = () => {
  const {
    role,
    isAuthenticated,
    viewMode,
    setViewMode,
    authTab,
    setAuthTab,
    loginAsDemo,
  } = useAppState();

  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [adminSessionState, setAdminSessionState] = useState(() => AdminAuthService.getStoredSession());

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setAdminSessionState(AdminAuthService.getStoredSession());
    };
    window.addEventListener('popstate', onLocationChange);
    return () => window.removeEventListener('popstate', onLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    setAdminSessionState(AdminAuthService.getStoredSession());
  };

  const isAdminRoute = currentPath.startsWith('/admin') || currentPath.startsWith('/secure-admin');
  const isAdminLoginRoute = currentPath === '/admin/login' || currentPath === '/secure-admin/login';

  // =========================================================================
  // 1. DEDICATED ADMIN / RESTRICTED ENCLAVE ROUTING
  // =========================================================================
  if (isAdminRoute) {
    // If explicitly on /admin/login
    if (isAdminLoginRoute) {
      if (adminSessionState && adminSessionState.role === 'super_admin') {
        // Already authenticated as admin -> enter command center
        return (
          <Suspense fallback={<AppLoadingScreen />}>
            <SuperAdminLayout
              initialPath={currentPath}
              onNavigateRoute={navigateTo}
              onAdminSignOut={() => {
                AdminAuthService.logout();
                setAdminSessionState(null);
                navigateTo('/admin/login');
              }}
            />
          </Suspense>
        );
      }

      return (
        <Suspense fallback={<AppLoadingScreen />}>
          <AdminLoginPage
            onLoginSuccess={() => {
              setAdminSessionState(AdminAuthService.getStoredSession());
              navigateTo('/admin');
            }}
            onExitToPublic={() => {
              navigateTo('/');
            }}
          />
        </Suspense>
      );
    }

    // Protected /admin/* routes:
    // Check if user has active Super Admin session
    if (adminSessionState && adminSessionState.role === 'super_admin') {
      return (
        <Suspense fallback={<AppLoadingScreen />}>
          <SuperAdminLayout
            initialPath={currentPath}
            onNavigateRoute={navigateTo}
            onAdminSignOut={() => {
              AdminAuthService.logout();
              setAdminSessionState(null);
              navigateTo('/admin/login');
            }}
          />
        </Suspense>
      );
    }

    // If a normal user (creator or brand) is logged in and navigates to /admin/*
    // Deny access strictly with 403 Forbidden AccessDeniedPage
    if (isAuthenticated) {
      return (
        <Suspense fallback={<AppLoadingScreen />}>
          <AccessDeniedPage
            onBackToApp={() => navigateTo('/')}
            onGoToAdminLogin={() => navigateTo('/admin/login')}
          />
        </Suspense>
      );
    }

    // Unauthenticated user attempting to access /admin -> Show dedicated Admin Login
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <AdminLoginPage
          onLoginSuccess={() => {
            setAdminSessionState(AdminAuthService.getStoredSession());
            navigateTo('/admin');
          }}
          onExitToPublic={() => {
            navigateTo('/');
          }}
        />
      </Suspense>
    );
  }

  // =========================================================================
  // 2. PUBLIC CREATOR & BRAND WORKSPACE
  // =========================================================================

  // Unauthenticated -> Welcome Landing Experience
  if (!isAuthenticated && viewMode === 'welcome') {
    return (
      <WelcomePage
        onGetStarted={() => {
          setAuthTab('signup');
          setViewMode('auth');
        }}
        onSignIn={() => {
          setAuthTab('login');
          setViewMode('auth');
        }}
        onExploreLiveStudio={() => {
          loginAsDemo('creator', 'live');
        }}
        onDemoAccess={(demoRole) => {
          loginAsDemo(demoRole, 'home');
        }}
      />
    );
  }

  // Unauthenticated -> Authentication Screen (Login / Sign-up)
  if (!isAuthenticated && viewMode === 'auth') {
    return (
      <AuthPage
        initialTab={authTab}
        onBackToWelcome={() => setViewMode('welcome')}
        onAuthSuccess={() => {
          setViewMode('app');
        }}
      />
    );
  }

  // Authenticated Public Role -> Creator or Brand Layout
  return (
    <Suspense fallback={<AppLoadingScreen />}>
      {role === 'business' ? (
        <BusinessLayout />
      ) : (
        <CreatorLayout />
      )}
    </Suspense>
  );
};

export default function App() {
  return (
    <StateProvider>
      <MainApp />
    </StateProvider>
  );
}
