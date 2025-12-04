disabled = {!hasPrevious}
className = {`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${hasPrevious
    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
    }`}
            >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm">{previousLabel}</span>
            </button >

    {/* Next button */ }
    < button
onClick = { onNext }
disabled = {!hasNext}
className = {`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${hasNext
    ? 'bg-[#00D563] text-white hover:bg-[#00C057] active:scale-95 shadow-sm'
    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
    }`}
            >
                <span className="text-sm">{nextLabel}</span>
                <ChevronRight className="w-4 h-4" />
            </button >
        </div >
    );
};
