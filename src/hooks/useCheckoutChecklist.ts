
import { useState, useEffect } from 'react';
import { ChecklistItem } from '@/components/checkout/CheckoutChecklist';

export const useCheckoutChecklist = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    {
      id: 'product-selected',
      title: 'Produto selecionado',
      description: 'Seu produto foi adicionado ao carrinho',
      completed: true,
    },
    {
      id: 'personal-info',
      title: 'Informações pessoais',
      description: 'Preencha seus dados para continuar',
      completed: false,
    },
    {
      id: 'payment-method',
      title: 'Método de pagamento',
      description: 'Escolha como deseja pagar',
      completed: false,
    },
    {
      id: 'confirm-payment',
      title: 'Confirmar pagamento',
      description: 'Revisar e finalizar sua compra',
      completed: false,
    }
  ]);

  const updateChecklistItem = (itemId: string, completed: boolean) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, completed } : item
      )
    );
  };

  const resetChecklist = () => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === 'product-selected' 
          ? { ...item, completed: true } 
          : { ...item, completed: false }
      )
    );
  };

  return {
    checklistItems,
    updateChecklistItem,
    resetChecklist
  };
};
