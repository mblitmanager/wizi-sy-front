export function LoadingNav() {
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="p-4">
                <div className="animate-pulse space-y-4">
                    {/* Logo skeleton */}
                    <div className="h-12 bg-gray-200 rounded-lg w-32"></div>

                    {/* Navigation items skeleton */}
                    <div className="space-y-2 mt-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 px-4 py-3">
                                <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
