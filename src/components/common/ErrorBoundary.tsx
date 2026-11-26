import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in SAHE 3D application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12] text-white p-6 font-sans">
          <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">3D Graphics Initialization Notice</h2>
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              The application encountered a graphics context or asset loading interruption. Ensure WebGL / hardware acceleration is enabled in your browser settings.
            </p>
            {this.state.error && (
              <div className="bg-slate-950/80 rounded-lg p-3 mb-6 text-left border border-white/5 overflow-x-auto text-xs text-red-300/80 font-mono max-h-28">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
