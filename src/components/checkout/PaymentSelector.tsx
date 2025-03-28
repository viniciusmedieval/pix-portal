
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCard } from 'lucide-react';

interface PaymentSelectorProps {
  onMethodChange: (method: 'pix' | 'cartao') => void;
  methods?: string[];
  defaultMethod?: 'pix' | 'cartao';
  className?: string;
}

export default function PaymentSelector({ 
  onMethodChange, 
  methods = ['pix', 'cartao'],
  defaultMethod = 'cartao',
  className = ''
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
      <div className={`mb-4 ${className}`}>
        <div className="flex items-center justify-center gap-2 py-2 bg-gray-50 rounded-lg">
          {method === 'pix' ? (
            <>
              <img src="/pix-logo.png" alt="PIX" className="w-5 h-5" />
              <span className="font-medium">Pague com PIX</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Pague com Cartão</span>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`mb-4 ${className}`}>
      <Tabs 
        defaultValue={activeMethod} 
        onValueChange={handleMethodChange}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full mb-4 p-1 h-auto bg-gray-100 rounded-lg">
          {methods.includes('cartao') && (
            <TabsTrigger 
              value="cartao" 
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-white rounded-md"
            >
              <CreditCard className="w-4 h-4" />
              <span>Cartão</span>
            </TabsTrigger>
          )}
          {methods.includes('pix') && (
            <TabsTrigger 
              value="pix" 
              className="flex items-center justify-center gap-2 py-3 data-[state=active]:bg-white rounded-md"
            >
              <img src="/pix-logo.png" alt="PIX" className="w-4 h-4" />
              <span>PIX</span>
            </TabsTrigger>
          )}
        </TabsList>
      </Tabs>
    </div>
  );
}
