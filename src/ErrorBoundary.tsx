import React from "react";

interface ErrorBoundaryState {
  error: Error | null;
  info: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    error: null,
    info: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
          <div className="max-w-2xl rounded-3xl border border-slate-200 bg-slate-50 p-8 shadow-xl">
            <h1 className="mb-4 text-2xl font-bold">Algo deu errado</h1>
            <p className="mb-4">O app encontrou um erro ao carregar.</p>
            <pre className="whitespace-pre-wrap rounded-xl bg-slate-100 p-4 text-sm text-slate-900">
              {this.state.error.message}
            </pre>
            {this.state.info?.componentStack && (
              <details className="mt-4 rounded-xl bg-slate-100 p-4 text-xs text-slate-700">
                <summary className="cursor-pointer font-medium">Stack trace</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.info.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
