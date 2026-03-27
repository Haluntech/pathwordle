import { ComponentType, Suspense, LazyExoticComponent } from 'react';

/**
 * Creates a lazy-loaded component with a loading fallback
 *
 * @param importFn - Function that imports the component
 * @param fallback - Optional fallback component to show while loading
 * @returns LazyExoticComponent
 *
 * @example
 * const LazyComponent = createLazyComponent(
 *   () => import('./MyComponent'),
 *   <div>Loading...</div>
 * );
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
): LazyExoticComponent<T> {
  const LazyComponent = React.lazy(importFn);

  const WrappedComponent: React.FC<React.ComponentProps<T>> = (props) => (
    <Suspense fallback={fallback || <DefaultLoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );

  (WrappedComponent as any).displayName = `LazyLoad(${importFn.toString()})`;

  return WrappedComponent as LazyExoticComponent<T>;
}

/**
 * Default loading fallback component
 */
const DefaultLoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

/**
 * Preload a lazy component
 *
 * @param lazyComponent - The lazy component to preload
 *
 * @example
 * const LazyComponent = React.lazy(() => import('./MyComponent'));
 * preloadLazyComponent(LazyComponent);
 */
export function preloadLazyComponent(lazyComponent: LazyExoticComponent<any>): void {
  lazyComponent['preload']?.();
}

/**
 * Create multiple lazy components at once
 *
 * @param components - Object mapping names to import functions
 * @returns Object mapping names to lazy components
 *
 * @example
 * const { GameResult, Statistics } = createLazyComponents({
 *   GameResult: () => import('./GameResult'),
 *   Statistics: () => import('./Statistics')
 * });
 */
export function createLazyComponents<T extends Record<string, () => Promise<{ default: ComponentType<any> }>>>(
  components: T
): { [K in keyof T]: LazyExoticComponent<ComponentType<any>> } {
  const result = {} as any;

  for (const [key, importFn] of Object.entries(components)) {
    result[key] = React.lazy(importFn);
  }

  return result;
}

// Import React to use React.lazy
import React from 'react';
