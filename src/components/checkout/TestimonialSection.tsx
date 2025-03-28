
import React from 'react';
import { Star } from 'lucide-react';
import TestimonialCard, { TestimonialType } from '@/components/TestimonialCard';

interface TestimonialSectionProps {
  testimonials: TestimonialType[];
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonials }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Avaliações dos clientes</h3>
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">4.8/5</span>
        </div>
      </div>
      <div className="space-y-4">
        {testimonials.map(testimonial => (
          <TestimonialCard 
            key={testimonial.id}
            user_name={testimonial.user_name}
            comment={testimonial.comment}
            rating={testimonial.rating}
            avatar_url={testimonial.avatar_url}
            created_at={testimonial.created_at}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialSection;
