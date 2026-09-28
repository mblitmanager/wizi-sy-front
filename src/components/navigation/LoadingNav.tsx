export function LoadingNav() {
    return (
        <div className="space-y-2 p-3" role="status" aria-live="polite">
            <span className="sr-only">Chargement du menu…</span>
            <div className="mx-3 mb-3 h-3 w-20 animate-pulse rounded bg-secondary" />
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-3 py-2">
                    <div className="h-8 w-8 animate-pulse rounded-lg bg-secondary" />
                    <div className="h-3.5 w-28 animate-pulse rounded bg-secondary" />
                </div>
            ))}
        </div>
    );
}
