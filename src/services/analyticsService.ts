interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private enabled: boolean = true;

  constructor(enabled: boolean = true) {
    this.enabled = enabled;
  }

  track(event: string, properties: Record<string, any> = {}): void {
    if (!this.enabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        user_agent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);

    // Console pour développement
    console.log('📊 Analytics:', analyticsEvent);

    // Ici vous pourriez envoyer vers votre service d'analytics
    // this.sendToAnalytics(analyticsEvent);
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents(): void {
    this.events = [];
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private async sendToAnalytics(event: AnalyticsEvent): Promise<void> {
    // Implémentation future pour envoyer vers un service d'analytics
    // comme Google Analytics, Mixpanel, etc.
  }
}