import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[CreatorOS Uncaught Exception]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#EDF0F4] flex flex-col justify-between p-6 sm:p-10 font-sans text-zinc-900">
          <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-zinc-200">
            <BrandLogo size="md" variant="light" />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Runtime Safeguard Triggered</span>
            </div>
          </header>

          <main className="max-w-xl mx-auto w-full my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                Application Rendering Interrupted
              </h1>
              <p className="text-xs sm:text-sm text-zinc-600">
                A component failed to render cleanly. Your session data and contracts remain safe in the vault.
              </p>
            </div>

            {this.state.error && (
              <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-left overflow-x-auto text-[11px] font-mono text-zinc-600 shadow-inner max-h-36">
                <span className="font-bold text-rose-700">Error:</span> {this.state.error.message}
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Home</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleReset}
                className="studio-btn-primary flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Workspace</span>
              </Button>
            </div>
          </main>

          <footer className="max-w-4xl mx-auto w-full pt-6 border-t border-zinc-200 text-center text-xs text-zinc-400">
            CreatorOS Safe Enclave • Resilient State Architecture
          </footer>
        </div>
      );
    }

    return this.props.children;
  }
}
