import React, { Suspense } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

const DefaultLoader = ({ size = 'medium' }: LoaderProps) => (
  <div className={`flex items-center justify-center w-full h-${size === 'small' ? '8' : size === 'medium' ? '16' : '32'}`}>
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>
);

interface WithSuspenseOptions {
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
}

export function withSuspense<P extends object>(
  Component: LazyExoticComponent<ComponentType<P>>,
  options: WithSuspenseOptions = {}
) {
  const { 
    fallback = <DefaultLoader />,
    errorBoundary = true 
  } = options;

  return function WithSuspenseWrapper(props: P) {
    const Wrapped = (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );

    if (!errorBoundary) return Wrapped;

    return (
      <ErrorBoundary>
        {Wrapped}
      </ErrorBoundary>
    );
  };
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold text-red-600">
            Oops! Une erreur est survenue.
          </h2>
          <button
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            onClick={() => this.setState({ hasError: false })}
          >
            Réessayer
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}