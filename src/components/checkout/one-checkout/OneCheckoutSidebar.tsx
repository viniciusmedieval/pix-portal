
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutChecklist from '../CheckoutChecklist';
import { ChecklistItem } from '../CheckoutChecklist';

interface OneCheckoutSidebarProps {
  checklistItems: ChecklistItem[];
}

const OneCheckoutSidebar: React.FC<OneCheckoutSidebarProps> = ({
  checklistItems
}) => {
  return (
    <Card>
      <CardContent className="p-4">
        <CheckoutChecklist items={checklistItems} />
      </CardContent>
    </Card>
  );
};

export default OneCheckoutSidebar;
