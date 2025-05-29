
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Une erreur s'est produite</h2>
          <p className="text-gray-600 mb-4">
            Nous nous excusons pour ce problème. Veuillez réessayer.
          </p>
          <Button 
            onClick={() => this.setState({ hasError: false, error: undefined })}
            variant="outline"
          >
            Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
