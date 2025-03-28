
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface PaymentSelectorProps {
  onMethodChange: (method: 'pix' | 'cartao') => void;
  methods?: string[];
  defaultMethod?: 'pix' | 'cartao';
}

export default function PaymentSelector({ 
  onMethodChange, 
  methods = ['pix', 'cartao'],
  defaultMethod = 'cartao'
}: PaymentSelectorProps) {
  const [activeMethod, setActiveMethod] = useState<'pix' | 'cartao'>(
    methods.includes(defaultMethod) ? defaultMethod : 'cartao'
  );

  const handleMethodChange = (value: string) => {
    const method = value as 'pix' | 'cartao';
    setActiveMethod(method);
    onMethodChange(method);
  };

  // If only one method is available, just show it without tabs
  if (methods.length === 1) {
    const method = methods[0] as 'pix' | 'cartao';
    return (
      <div className="mb-4">
        <div className="text-right text-sm font-medium text-gray-600">
          {method === 'pix' ? 'PIX' : 'Cartão de crédito'}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Tabs 
        defaultValue={activeMethod} 
        onValueChange={handleMethodChange}
        className="w-full"
      >
        <div className="flex justify-end mb-2">
          <TabsList className="grid grid-cols-2 w-48">
            {methods.includes('cartao') && (
              <TabsTrigger value="cartao" className="text-xs">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Cartão
              </TabsTrigger>
            )}
            {methods.includes('pix') && (
              <TabsTrigger value="pix" className="text-xs">
                <img src="/pix-logo.png" alt="PIX" className="w-4 h-4 mr-1" />
                PIX
              </TabsTrigger>
            )}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
}
