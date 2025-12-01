import React from "react";

/**
 * Composant de chargement optimisé avec animations CSS pures
 * Très léger et performant, sans images lourdes
 */
export const OptimizedLoadingState = React.memo(() => {
    return (
        <div className="flex items-center justify-center min-h-[200px] w-full">
            <div className="flex flex-col items-center gap-3">
                {/* Spinner optimisé avec CSS pur */}
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-yellow-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin" />
                </div>

                {/* Texte de chargement */}
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Chargement...
                </p>
            </div>
        </div>
    );
});

OptimizedLoadingState.displayName = "OptimizedLoadingState";

/**
 * Variante fullscreen pour le chargement initial
 */
export const OptimizedFullScreenLoader = React.memo(() => {
    return (
        <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner plus large pour fullscreen */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-yellow-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin" />
                </div>

                <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Chargement...
                </p>
            </div>
        </div>
    );
});

OptimizedFullScreenLoader.displayName = "OptimizedFullScreenLoader";
