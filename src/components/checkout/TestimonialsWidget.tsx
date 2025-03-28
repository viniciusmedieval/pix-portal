
import React from 'react';
import { Testimonial } from '@/pages/CheckoutPage';

interface TestimonialsWidgetProps {
  testimonials: Testimonial[];
}

const TestimonialsWidget: React.FC<TestimonialsWidgetProps> = ({ testimonials }) => {
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="font-medium text-lg mb-4">O que dizem nossos clientes</h2>
      <div className="space-y-6">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="border-b pb-4 last:border-b-0 last:pb-0">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                {testimonial.avatar_url ? (
                  <img src={testimonial.avatar_url} alt={testimonial.user_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary text-white">
                    {testimonial.user_name.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium">{testimonial.user_name}</p>
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-700">{testimonial.comment}</p>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500 mt-4 text-right">
        {testimonials.length} comentários
      </div>
    </div>
  );
};

export default TestimonialsWidget;
