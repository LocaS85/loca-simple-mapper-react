import React, { memo, useMemo, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import { LoadingSkeleton } from '../atoms';

// Lazy loading des composants lourds - Utilisation des composants unifiés
const EnhancedResultsList = lazy(() => import('../../enhanced/EnhancedResultsList'));
const EnhancedSearchBar = lazy(() => import('../../enhanced/EnhancedSearchBar'));

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

// Composants unifiés avec lazy loading
export const LazyEnhancedResultsList: React.FC<any> = memo((props) => (
  <LazyComponentWrapper fallback={<LoadingSkeleton type="list" count={5} />}>
    <EnhancedResultsList virtualizeResults={props.virtualizeResults || props.results?.length > 20} {...props} />
  </LazyComponentWrapper>
));

export const LazyEnhancedSearchBar: React.FC<any> = memo((props) => (
  <LazyComponentWrapper fallback={<LoadingSkeleton type="filter" />}>
    <EnhancedSearchBar {...props} />
  </LazyComponentWrapper>
));

LazyEnhancedResultsList.displayName = 'LazyEnhancedResultsList';
LazyEnhancedSearchBar.displayName = 'LazyEnhancedSearchBar';

export default LazyComponentWrapper;