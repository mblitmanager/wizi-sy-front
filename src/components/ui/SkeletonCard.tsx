const SkeletonCard = () => (
  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm animate-pulse flex flex-col space-y-4">
    <div className="h-40 w-full bg-gray-200 rounded-lg" />
    <div className="h-5 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
    <div className="h-4 bg-gray-200 rounded w-2/3" />
    <div className="flex justify-between">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-4 bg-gray-200 rounded w-1/4" />
    </div>
    <div className="h-10 bg-gray-300 rounded-xl w-full mt-auto" />
  </div>
);

export default SkeletonCard;
