
import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface CheckoutFormLayoutProps {
  children: ReactNode;
  headerText?: string;
  headerBgColor?: string;
  headerTextColor?: string;
}

const CheckoutFormLayout = ({
  children,
  headerText,
  headerBgColor = '#dc2626',
  headerTextColor = '#ffffff'
}: CheckoutFormLayoutProps) => {
  return (
    <div className="w-full space-y-6">
      {headerText && (
        <div 
          className="w-full py-3 px-4 text-center text-sm font-bold rounded-t-md"
          style={{ 
            backgroundColor: headerBgColor,
            color: headerTextColor
          }}
        >
          {headerText}
        </div>
      )}
      {children}
    </div>
  );
};

export default CheckoutFormLayout;
