
import React from 'react';
import UserCounter from '@/components/checkout/UserCounter';

interface VisitorCounterWidgetProps {
  baseNumber?: number;
}

const VisitorCounterWidget: React.FC<VisitorCounterWidgetProps> = ({ baseNumber = 85 }) => {
  return (
    <div className="bg-white bg-opacity-80 rounded-xl p-4 shadow-sm">
      <UserCounter baseNumber={baseNumber} />
    </div>
  );
};

export default VisitorCounterWidget;
