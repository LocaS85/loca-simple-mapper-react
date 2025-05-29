
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { errorService } from '@/services/errorService';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    errorId: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Capturer l'erreur avec le service d'erreurs
    errorService.captureError(error, {
      component: 'ErrorBoundary',
      action: 'component-error'
    });

    this.setState({ errorInfo });

    // Appeler le callback personnalisé si fourni
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  private copyErrorDetails = () => {
    const errorDetails = {
      error: this.state.error?.toString(),
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert('Détails de l\'erreur copiés dans le presse-papiers');
      })
      .catch(() => {
        console.log('Impossible de copier les détails');
      });
  };

  public render() {
    if (this.state.hasError) {
      // Rendu de fallback personnalisé si fourni
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-lg w-full bg-white shadow-xl rounded-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Une erreur est survenue
            </h1>
            
            <p className="text-gray-600 mb-6">
              Nous nous excusons pour ce problème technique. Votre session sera restaurée après correction.
            </p>

            {this.state.errorId && (
              <div className="bg-gray-100 p-3 rounded mb-4">
                <p className="text-sm text-gray-600">
                  ID d'erreur: <code className="font-mono">{this.state.errorId}</code>
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleRetry}
                className="flex items-center gap-2"
                variant="outline"
              >
                <RefreshCw className="h-4 w-4" />
                Réessayer
              </Button>
              
              <Button
                onClick={this.handleReload}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Recharger la page
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left mt-6 bg-gray-100 p-4 rounded">
                <summary className="cursor-pointer text-sm font-medium flex items-center gap-2 mb-2">
                  <Bug className="h-4 w-4" />
                  Détails techniques (développement)
                </summary>
                <div className="space-y-2">
                  <div>
                    <strong>Erreur:</strong>
                    <pre className="text-xs mt-1 overflow-auto bg-red-50 p-2 rounded">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack trace:</strong>
                      <pre className="text-xs mt-1 overflow-auto bg-gray-50 p-2 rounded max-h-40">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  <Button
                    onClick={this.copyErrorDetails}
                    size="sm"
                    variant="outline"
                    className="mt-2"
                  >
                    Copier les détails
                  </Button>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
