
import React from 'react';
import { Users } from 'lucide-react';

interface VisitorCounterProps {
  visitors: number;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ visitors }) => {
  if (visitors <= 0) return null;
  
  return (
    <div className="bg-red-50 border border-red-100 rounded-lg p-4 mt-6 flex items-center gap-3 shadow-sm">
      <div className="relative">
        <Users className="h-5 w-5 text-red-500" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      </div>
      <p className="text-sm text-gray-700">
        <strong>{visitors}</strong> pessoas estão vendo essa página agora
      </p>
    </div>
  );
};

export default VisitorCounter;
