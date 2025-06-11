
class ErrorService {
  private static instance: ErrorService;

  static getInstance(): ErrorService {
    if (!ErrorService.instance) {
      ErrorService.instance = new ErrorService();
    }
    return ErrorService.instance;
  }

  logError(error: Error, context?: string): void {
    console.error('Error logged:', { error, context, timestamp: new Date().toISOString() });
  }

  captureError(error: Error | string, context?: string): void {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    this.logError(errorObj, context);
  }

  handleNetworkError(error: Error): void {
    console.error('Network error:', error.message);
  }

  handleApiError(error: any, endpoint?: string): void {
    console.error('API error:', { error, endpoint });
  }
}

export const errorService = ErrorService.getInstance();
