import { SearchResult, TransportMode } from '@/types/unified';
import { secureMapboxService } from '@/services/secureMapboxService';

interface BatchRequest {
  id: string;
  type: 'geocoding' | 'directions' | 'isochrone';
  params: any;
  priority: 'high' | 'normal' | 'low';
  timestamp: number;
  retries: number;
}

interface QueuedRequest extends BatchRequest {
  resolve: (result: any) => void;
  reject: (error: Error) => void;
}

interface BatchMetrics {
  totalRequests: number;
  batchedRequests: number;
  averageBatchSize: number;
  compressionRatio: number;
  averageLatency: number;
  errorRate: number;
}

export class BatchMapboxService {
  private static instance: BatchMapboxService;
  private requestQueue: QueuedRequest[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private readonly batchSize = 25; // Mapbox limit
  private readonly batchDelay = 100; // ms
  private readonly maxRetries = 3;
  private inFlightRequests = new Set<string>();
  private metrics: BatchMetrics = {
    totalRequests: 0,
    batchedRequests: 0,
    averageBatchSize: 0,
    compressionRatio: 0,
    averageLatency: 0,
    errorRate: 0
  };

  static getInstance(): BatchMapboxService {
    if (!BatchMapboxService.instance) {
      BatchMapboxService.instance = new BatchMapboxService();
    }
    return BatchMapboxService.instance;
  }

  async geocodeBatch(queries: string[], center?: [number, number]): Promise<SearchResult[][]> {
    console.log(`📦 Batch geocoding: ${queries.length} requêtes`);
    
    const requests = queries.map((query, index) => 
      this.queueRequest({
        type: 'geocoding',
        params: { query, center },
        priority: 'normal'
      }, `geocode_${index}`)
    );

    return Promise.all(requests);
  }

  async directionseBatch(
    origins: [number, number][],
    destinations: [number, number][],
    transportMode: TransportMode
  ): Promise<any[][]> {
    console.log(`📦 Batch directions: ${origins.length}x${destinations.length} requêtes`);
    
    const requests: Promise<any>[] = [];
    
    for (let i = 0; i < origins.length; i++) {
      for (let j = 0; j < destinations.length; j++) {
        requests.push(
          this.queueRequest({
            type: 'directions',
            params: { 
              origin: origins[i], 
              destination: destinations[j], 
              transportMode 
            },
            priority: 'normal'
          }, `directions_${i}_${j}`)
        );
      }
    }

    return Promise.all(requests);
  }

  async searchPlacesOptimized(
    query: string,
    center: [number, number],
    options: {
      limit?: number;
      radius?: number;
      categories?: string[];
    } = {}
  ): Promise<SearchResult[]> {
    // Check for duplicate requests in queue
    const existingRequest = this.findDuplicateRequest('geocoding', { query, center });
    if (existingRequest) {
      console.log(`🔄 Request coalescing pour: ${query}`);
      return new Promise((resolve, reject) => {
        existingRequest.resolve = resolve;
        existingRequest.reject = reject;
      });
    }

    return this.queueRequest({
      type: 'geocoding',
      params: { query, center, ...options },
      priority: 'high' // User interaction = high priority
    }, `search_${query}_${Date.now()}`);
  }

  private async queueRequest(request: Omit<BatchRequest, 'id' | 'timestamp' | 'retries'>, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const queuedRequest: QueuedRequest = {
        ...request,
        id,
        timestamp: Date.now(),
        retries: 0,
        resolve,
        reject
      };

      this.requestQueue.push(queuedRequest);
      this.metrics.totalRequests++;
      
      this.scheduleBatchProcessing();
    });
  }

  private findDuplicateRequest(type: string, params: any): QueuedRequest | null {
    return this.requestQueue.find(req => 
      req.type === type && 
      JSON.stringify(req.params) === JSON.stringify(params)
    ) || null;
  }

  private scheduleBatchProcessing(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
    }

    this.batchTimer = setTimeout(() => {
      this.processBatch();
    }, this.batchDelay);

    // Force processing if queue is full
    if (this.requestQueue.length >= this.batchSize) {
      clearTimeout(this.batchTimer);
      this.processBatch();
    }
  }

  private async processBatch(): Promise<void> {
    if (this.requestQueue.length === 0) return;

    const startTime = performance.now();
    
    // Group requests by type and priority
    const batches = this.groupRequestsIntoBatches();
    
    console.log(`🚀 Processing ${batches.length} batches, ${this.requestQueue.length} requests total`);
    
    for (const batch of batches) {
      try {
        await this.processSingleBatch(batch);
      } catch (error) {
        console.error('❌ Batch processing error:', error);
        this.handleBatchError(batch, error);
      }
    }

    const processingTime = performance.now() - startTime;
    this.updateMetrics(batches.length, processingTime);
    
    // Clear processed requests
    this.requestQueue = [];
  }

  private groupRequestsIntoBatches(): QueuedRequest[][] {
    const groups = new Map<string, QueuedRequest[]>();
    
    // Sort by priority
    this.requestQueue.sort((a, b) => {
      const priorities = { high: 3, normal: 2, low: 1 };
      return priorities[b.priority] - priorities[a.priority];
    });

    // Group by type
    for (const request of this.requestQueue) {
      const key = request.type;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(request);
    }

    // Split into batches of max size
    const batches: QueuedRequest[][] = [];
    for (const [type, requests] of groups) {
      for (let i = 0; i < requests.length; i += this.batchSize) {
        batches.push(requests.slice(i, i + this.batchSize));
      }
    }

    return batches;
  }

  private async processSingleBatch(batch: QueuedRequest[]): Promise<void> {
    if (batch.length === 0) return;

    const batchType = batch[0].type;
    
    try {
      switch (batchType) {
        case 'geocoding':
          await this.processGeocodingBatch(batch);
          break;
        case 'directions':
          await this.processDirectionsBatch(batch);
          break;
        case 'isochrone':
          await this.processIsochroneBatch(batch);
          break;
        default:
          throw new Error(`Type de batch non supporté: ${batchType}`);
      }
    } catch (error) {
      this.handleBatchError(batch, error);
    }
  }

  private async processGeocodingBatch(batch: QueuedRequest[]): Promise<void> {
    console.log(`🔍 Processing geocoding batch: ${batch.length} requests`);
    
    for (const request of batch) {
      try {
        const { query, center, limit, radius, categories } = request.params;
        
        const results = await secureMapboxService.searchPlaces(query, center, {
          limit,
          radius,
          categories
        });
        
        request.resolve(results);
        
      } catch (error) {
        if (request.retries < this.maxRetries) {
          request.retries++;
          this.requestQueue.push(request);
        } else {
          request.reject(error as Error);
        }
      }
    }
  }

  private async processDirectionsBatch(batch: QueuedRequest[]): Promise<void> {
    console.log(`🚗 Processing directions batch: ${batch.length} requests`);
    
    for (const request of batch) {
      try {
        const { origin, destination, transportMode } = request.params;
        
        const directions = await secureMapboxService.getDirections(
          origin,
          destination,
          transportMode
        );
        
        request.resolve(directions);
        
      } catch (error) {
        if (request.retries < this.maxRetries) {
          request.retries++;
          this.requestQueue.push(request);
        } else {
          request.reject(error as Error);
        }
      }
    }
  }

  private async processIsochroneBatch(batch: QueuedRequest[]): Promise<void> {
    console.log(`⏱️ Processing isochrone batch: ${batch.length} requests`);
    
    for (const request of batch) {
      try {
        const { center, duration, transportMode } = request.params;
        
        const isochrone = await secureMapboxService.createIsochrone(
          center,
          duration,
          transportMode
        );
        
        request.resolve(isochrone);
        
      } catch (error) {
        if (request.retries < this.maxRetries) {
          request.retries++;
          this.requestQueue.push(request);
        } else {
          request.reject(error as Error);
        }
      }
    }
  }

  private handleBatchError(batch: QueuedRequest[], error: any): void {
    console.error(`❌ Batch error for ${batch.length} requests:`, error);
    
    for (const request of batch) {
      if (request.retries < this.maxRetries) {
        request.retries++;
        this.requestQueue.push(request);
      } else {
        request.reject(new Error(`Max retries exceeded: ${error.message}`));
      }
    }
  }

  private updateMetrics(batchCount: number, processingTime: number): void {
    this.metrics.batchedRequests += batchCount;
    this.metrics.averageBatchSize = this.metrics.totalRequests / (this.metrics.batchedRequests || 1);
    this.metrics.averageLatency = (this.metrics.averageLatency + processingTime) / 2;
    
    // Calculate compression ratio (requests saved by batching)
    const individualRequests = this.metrics.totalRequests;
    const batchedRequests = this.metrics.batchedRequests;
    this.metrics.compressionRatio = batchedRequests > 0 
      ? (individualRequests - batchedRequests) / individualRequests 
      : 0;
  }

  getMetrics(): BatchMetrics {
    return { ...this.metrics };
  }

  getQueueStats(): {
    queueLength: number;
    inFlightRequests: number;
    priorityDistribution: { high: number; normal: number; low: number };
  } {
    const priorityDistribution = this.requestQueue.reduce(
      (acc, req) => {
        acc[req.priority]++;
        return acc;
      },
      { high: 0, normal: 0, low: 0 }
    );

    return {
      queueLength: this.requestQueue.length,
      inFlightRequests: this.inFlightRequests.size,
      priorityDistribution
    };
  }

  clearQueue(): void {
    this.requestQueue.forEach(req => 
      req.reject(new Error('Queue cleared'))
    );
    this.requestQueue = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    console.log('🧹 Batch queue cleared');
  }
}

export const batchMapboxService = BatchMapboxService.getInstance();