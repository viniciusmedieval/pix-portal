
import React, { useEffect, useState } from 'react';
import { FaqItem } from '@/types/checkoutConfig';
import { getFaqs } from '@/services/faqService';

interface FaqSectionProps {
  faqs?: FaqItem[];
  productId?: string;
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs: propFaqs, productId }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>(propFaqs || []);
  const [loading, setLoading] = useState(!propFaqs && !!productId);

  useEffect(() => {
    if (propFaqs) {
      setFaqs(propFaqs);
      return;
    }
    
    if (productId) {
      const loadFaqs = async () => {
        try {
          const loadedFaqs = await getFaqs(productId);
          if (loadedFaqs && loadedFaqs.length > 0) {
            setFaqs(loadedFaqs);
          }
        } catch (error) {
          console.error("Error loading FAQs:", error);
        } finally {
          setLoading(false);
        }
      };
      loadFaqs();
    }
  }, [productId, propFaqs]);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Carregando perguntas frequentes...</div>;
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Perguntas frequentes</h3>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index}>
            <h4 className="font-medium mb-1">{faq.question}</h4>
            <p className="text-sm text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqSection;
