import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
            <h1 className="mb-4 text-2xl font-bold text-red-600">Une erreur est survenue</h1>
            <p className="mb-4 text-gray-700">
              Désolé, une erreur inattendue s'est produite. Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="p-4 mt-4 overflow-auto text-sm text-left bg-gray-100 rounded-md">
                <p className="font-semibold">Détails de l'erreur:</p>
                <pre className="mt-2 text-xs">{this.state.error.message}</pre>
                <pre className="mt-2 text-xs">{this.state.error.stack}</pre>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 