
import React from 'react';

interface VisitorCounterProps {
  visitors: number;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ visitors }) => {
  if (visitors <= 0) return null;
  
  return (
    <div className="bg-red-50 border border-red-100 rounded p-3 mt-4 flex items-center gap-2">
      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      <p className="text-sm text-gray-700">
        <strong>{visitors}</strong> pessoas estão vendo essa página agora
      </p>
    </div>
  );
};

export default VisitorCounter;
