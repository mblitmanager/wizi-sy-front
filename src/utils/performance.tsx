import React, { lazy, Suspense } from 'react';

/**
 * Utilitaires de Performance
 * 
 * Ce fichier contient des helpers pour optimiser les performances de l'application.
 */

/**
 * Créer un composant lazy avec un fallback de chargement
 * 
 * @example
 * const LazyComponent = createLazyComponent(
 *   () => import('./HeavyComponent'),
 *   <div>Chargement...</div>
 * );
 */
export function createLazyComponent<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback: React.ReactNode = <div className="flex items-center justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
) {
    const LazyComponent = lazy(importFunc);

    return (props: React.ComponentProps<T>) => (
        <Suspense fallback={fallback}>
            <LazyComponent {...props} />
        </Suspense>
    );
}

/**
 * Hook personnalisé pour debounce d'une valeur
 * Utile pour les champs de recherche et filtres
 * 
 * @example
 * const debouncedSearch = useDebounce(searchTerm, 300);
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook pour détecter si un élément est visible (Intersection Observer)
 * Utile pour lazy loading d'images ou composants
 * 
 * @example
 * const [ref, isVisible] = useIntersectionObserver();
 * 
 * return (
 *   <div ref={ref}>
 *     {isVisible && <HeavyComponent />}
 *   </div>
 * );
 */
export function useIntersectionObserver(
    options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
    const [isIntersecting, setIntersecting] = React.useState(false);
    const [node, setNode] = React.useState<Element | null>(null);

    React.useEffect(() => {
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIntersecting(entry.isIntersecting),
            options
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [node, options]);

    return [setNode, isIntersecting];
}

/**
 * Optimiser les images avec lazy loading et formats modernes
 * 
 * @example
 * <OptimizedImage 
 *   src="/image.jpg" 
 *   alt="Description"
 *   width={200}
 *   height={200}
 * />
 */
interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = ''
}: OptimizedImageProps) {
    return (
        <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
            decoding="async"
            className={className}
        />
    );
}

/**
 * Composant de chargement par défaut
 */
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className="flex items-center justify-center p-4">
            <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]}`} />
        </div>
    );
}
