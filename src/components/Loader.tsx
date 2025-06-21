import React from 'react';
import useAppStore from '../store';

const Loader: React.FC = () => {
  const isLoading = useAppStore((state) => state.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="loader-overlay">
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
