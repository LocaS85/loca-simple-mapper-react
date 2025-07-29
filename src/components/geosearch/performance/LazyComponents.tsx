import React, { memo, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSkeleton } from '../atoms';

// Lazy loading des composants lourds
const VirtualizedResultsList = lazy(() => import('./VirtualizedResultsList'));
const OptimizedSearchBar = lazy(() => import('./OptimizedSearchBar'));

interface LazyComponentWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<any>;
}

const LazyComponentWrapper: React.FC<LazyComponentWrapperProps> = memo(({
  children,
  fallback,
  errorFallback: ErrorFallback
}) => {
  const defaultFallback = useMemo(
    () => fallback || <LoadingSkeleton type="card" />,
    [fallback]
  );

  const defaultErrorFallback = useMemo(
    () => ErrorFallback || (({ error }: { error: Error }) => (
      <div className="p-4 text-center">
        <p className="text-destructive">Erreur de chargement: {error.message}</p>
      </div>
    )),
    [ErrorFallback]
  );

  return (
    <ErrorBoundary FallbackComponent={defaultErrorFallback}>
      <Suspense fallback={defaultFallback}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </Suspense>
    </ErrorBoundary>
  );
});

LazyComponentWrapper.displayName = 'LazyComponentWrapper';

// Composants optimisés avec lazy loading
export const LazyVirtualizedResultsList: React.FC<any> = memo((props) => (
  <LazyComponentWrapper fallback={<LoadingSkeleton type="list" count={5} />}>
    <VirtualizedResultsList {...props} />
  </LazyComponentWrapper>
));

export const LazyOptimizedSearchBar: React.FC<any> = memo((props) => (
  <LazyComponentWrapper fallback={<LoadingSkeleton type="filter" />}>
    <OptimizedSearchBar {...props} />
  </LazyComponentWrapper>
));

LazyVirtualizedResultsList.displayName = 'LazyVirtualizedResultsList';
LazyOptimizedSearchBar.displayName = 'LazyOptimizedSearchBar';

export default LazyComponentWrapper;