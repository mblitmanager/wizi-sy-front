const PaginationControls = ({
  currentPage,
  lastPage,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}) => (
  <div className="flex justify-center gap-2 mt-6">
    <button
      className="px-3 py-1 border rounded"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}>
      Précédent
    </button>
    {[...Array(lastPage)].map((_, index) => (
      <button
        key={index}
        onClick={() => onPageChange(index + 1)}
        className={`px-3 py-1 border rounded ${
          currentPage === index + 1 ? "bg-blue-500 text-white" : ""
        }`}>
        {index + 1}
      </button>
    ))}
    <button
      className="px-3 py-1 border rounded"
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === lastPage}>
      Suivant
    </button>
  </div>
);

export default PaginationControls;
