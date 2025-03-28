
import React from 'react';
import { FaqItem } from '@/types/checkoutConfig';

interface FaqSectionProps {
  faqs: FaqItem[];
}

const FaqSection: React.FC<FaqSectionProps> = ({ faqs }) => {
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
