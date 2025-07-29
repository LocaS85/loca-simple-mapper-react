import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type: 'sidebar' | 'card' | 'list' | 'map' | 'filter';
  count?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type,
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'sidebar':
        return (
          <div className={`space-y-4 p-3 ${className}`}>
            <Skeleton className="h-6 w-20" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        );

      case 'card':
        return (
          <div className={`p-4 border rounded-lg space-y-3 ${className}`}>
            <div className="flex items-start gap-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`space-y-2 ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        );

      case 'map':
        return (
          <div className={`relative w-full h-full bg-muted rounded-lg ${className}`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="space-y-2 text-center">
                <Skeleton className="h-8 w-8 rounded-full mx-auto" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        );

      case 'filter':
        return (
          <div className={`space-y-2 ${className}`}>
            <Skeleton className="h-4 w-16" />
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        );

      default:
        return <Skeleton className={`h-4 w-full ${className}`} />;
    }
  };

  return count > 1 && type !== 'list' ? (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>{renderSkeleton()}</div>
      ))}
    </div>
  ) : (
    renderSkeleton()
  );
};

export default LoadingSkeleton;