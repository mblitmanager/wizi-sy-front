const PaginationControls = ({
  currentPage,
  lastPage,
  onPageChange,
  nextPageUrl,
  prevPageUrl,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}) => {
  const generatePageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (lastPage <= 7) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 4) pages.push("...");

      const start = Math.max(2, currentPage - 2);
      const end = Math.min(lastPage - 1, currentPage + 2);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < lastPage - 3) pages.push("...");

      pages.push(lastPage);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex justify-center gap-2 mt-6 flex-wrap">
      <button
        className="px-3 py-1 border rounded"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!prevPageUrl || currentPage === 1}>
        Précédent
      </button>

      {pageNumbers.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-1">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border rounded ${
              currentPage === page ? "bg-blue-500 text-white" : ""
            }`}>
            {page}
          </button>
        )
      )}

      <button
        className="px-3 py-1 border rounded"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!nextPageUrl || currentPage === lastPage}>
        Suivant
      </button>
    </div>
  );
};

export default PaginationControls;
