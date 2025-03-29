
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Star, CheckCircle2 } from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  content: string;
  rating: number;
  avatar: string;
  date: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  testimonials,
  title 
}) => {
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <span className="text-sm text-gray-500">{testimonials.length} comentários</span>
        </div>
        
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="border-b pb-4 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold">{testimonial.author}</p>
                    <span className="text-xs text-gray-500">{testimonial.date}</span>
                  </div>
                  <div className="flex text-yellow-500 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < testimonial.rating ? 'currentColor' : 'none'}
                        color={i < testimonial.rating ? 'currentColor' : '#ccc'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mt-2 text-sm">{testimonial.content}</p>
                  
                  <div className="flex gap-4 mt-2">
                    <button className="text-xs text-gray-500 flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Útil
                    </button>
                    <button className="text-xs text-gray-500 flex items-center">
                      Não útil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialsSection;
