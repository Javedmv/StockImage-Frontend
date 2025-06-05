const ShimmerFallback = () => {
    const placeholders = Array(12).fill(null);
  
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {placeholders.map((_, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-lg shadow-md overflow-hidden animate-pulse"
          >
            <div className="h-40 bg-gray-300 w-full"></div>
  
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
  
              <div className="flex gap-2 mt-2">
                <div className="h-6 w-12 bg-gray-300 rounded"></div>
                <div className="h-6 w-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default ShimmerFallback;
  