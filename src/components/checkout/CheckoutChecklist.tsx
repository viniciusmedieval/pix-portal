
import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

interface CheckoutChecklistProps {
  items: ChecklistItem[];
  className?: string;
}

const CheckoutChecklist: React.FC<CheckoutChecklistProps> = ({ 
  items,
  className
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-lg font-medium mb-2">Status do pedido</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {item.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-300" />
              )}
            </div>
            <div>
              <p className={cn(
                "font-medium", 
                item.completed ? "text-green-700" : "text-gray-700"
              )}>
                {item.title}
              </p>
              {item.description && (
                <p className="text-sm text-gray-500">{item.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckoutChecklist;
