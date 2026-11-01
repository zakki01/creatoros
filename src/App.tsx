import React, { Suspense, lazy, useState, useEffect } from 'react';
import { StateProvider, useAppState } from './context/StateContext';
import { ThemeProvider } from './context/ThemeContext';
import { WelcomePage } from './features/auth/components/WelcomePage';
import { BrandLogo } from './components/common/BrandLogo';
import { AdminAuthService } from './features/auth/services/authService';
import { ToastProvider } from './components/ui';
import { DesignSystemDemo } from './components/ui/DesignSystemDemo';
import { ErrorBoundary } from './components/common/ErrorBoundary';

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

const TermsPage = lazy(() =>
  import('./components/legal/TermsPage').then((m) => ({
    default: m.TermsPage,
  }))
);

const PrivacyPage = lazy(() =>
  import('./components/legal/PrivacyPage').then((m) => ({
    default: m.PrivacyPage,
  }))
);

const SupportPortal = lazy(() =>
  import('./components/support/SupportPortal').then((m) => ({
    default: m.SupportPortal,
  }))
);

const NotFoundPage = lazy(() =>
  import('./components/common/NotFoundPage').then((m) => ({
    default: m.NotFoundPage,
  }))
);

const Error500Page = lazy(() =>
  import('./components/common/Error500Page').then((m) => ({
    default: m.Error500Page,
  }))
);

const AppLoadingScreen: React.FC = () => (
  <div className="h-screen w-full bg-[var(--background)] text-[var(--text-primary)] flex flex-col items-center justify-center space-y-4 font-sans">
    <div className="animate-pulse">
      <BrandLogo size="lg" iconOnly />
    </div>
    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
      <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
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

  // Design System Demo Route (Phase 2 Component Verification)
  if (
    currentPath === '/design-system' ||
    (typeof window !== 'undefined' &&
      (window.location.hash === '#design-system' ||
        window.location.search.includes('demo=design-system')))
  ) {
    return <DesignSystemDemo onBack={() => navigateTo('/')} />;
  }

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
  // 2. PUBLIC LEGAL, SUPPORT & ERROR PAGES (Accredited Public Routes)
  // =========================================================================
  if (currentPath === '/terms' || currentPath === '/legal/terms') {
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <TermsPage onBack={() => navigateTo('/')} />
      </Suspense>
    );
  }

  if (currentPath === '/privacy' || currentPath === '/legal/privacy') {
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <PrivacyPage onBack={() => navigateTo('/')} />
      </Suspense>
    );
  }

  if (currentPath === '/support' || currentPath.startsWith('/support/')) {
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <SupportPortal onBack={() => navigateTo('/')} />
      </Suspense>
    );
  }

  if (currentPath === '/500') {
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <Error500Page onGoHome={() => navigateTo('/')} />
      </Suspense>
    );
  }

  if (currentPath === '/404') {
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <NotFoundPage onGoHome={() => navigateTo('/')} onGoBack={() => window.history.back()} />
      </Suspense>
    );
  }

  // Check if non-existent unrecognized route was accessed directly
  const knownPrefixes = [
    '/',
    '/brand',
    '/creator',
    '/admin',
    '/secure-admin',
    '/terms',
    '/legal',
    '/privacy',
    '/support',
    '/design-system',
    '/500',
    '/404',
  ];
  const isKnownRoute = knownPrefixes.some(
    (p) => currentPath === p || (p !== '/' && currentPath.startsWith(p))
  );

  if (!isKnownRoute) {
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <NotFoundPage onGoHome={() => navigateTo('/')} onGoBack={() => window.history.back()} />
      </Suspense>
    );
  }

  // =========================================================================
  // 3. PUBLIC CREATOR & BRAND WORKSPACE
  // =========================================================================

  // Unauthenticated -> Focused Single Welcome & Authentication Experience
  if (!isAuthenticated) {
    return (
      <WelcomePage
        initialAuthMode={authTab === 'signup' ? 'register' : 'signin'}
        onDemoAccess={(demoRole) => {
          if (import.meta.env.VITE_ENABLE_DEMO === 'true') {
            loginAsDemo(demoRole, 'home');
          }
        }}
      />
    );
  }

  // Authenticated Public Role -> Creator or Brand Layout with Strict Role Isolation
  if (role === 'business') {
    if (currentPath.startsWith('/creator')) {
      window.history.replaceState(null, '', '/brand');
    }
    return (
      <Suspense fallback={<AppLoadingScreen />}>
        <BusinessLayout />
      </Suspense>
    );
  }

  // Creator workspace isolation
  if (currentPath.startsWith('/brand')) {
    window.history.replaceState(null, '', '/creator');
  }
  return (
    <Suspense fallback={<AppLoadingScreen />}>
      <CreatorLayout />
    </Suspense>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <StateProvider>
          <ToastProvider>
            <MainApp />
          </ToastProvider>
        </StateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
