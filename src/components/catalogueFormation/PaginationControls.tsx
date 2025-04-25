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
}) => (
  <div className="flex justify-center gap-2 mt-6">
    <button
      className="px-3 py-1 border rounded"
      onClick={() => onPageChange(currentPage - 1)}
      disabled={!prevPageUrl || currentPage === 1}>
      Précédent
    </button>

    {/* Affichage des pages */}
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
      onClick={() => {
        console.log(`Current page before change: ${currentPage}`);
        console.log(`Trying to go to page ${currentPage + 1}`);
        onPageChange(currentPage + 1);
      }}
      disabled={!nextPageUrl || currentPage === lastPage}>
      Suivant
    </button>
  </div>
);
export default PaginationControls;
