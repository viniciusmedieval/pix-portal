
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { Star } from 'lucide-react';

interface Testimonial {
  user_name: string;
  rating: number;
  comment: string;
  avatar_url?: string;
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  title?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
  testimonials = [], 
  title = "O que nossos clientes dizem" 
}) => {
  const isMobile = useIsMobile();
  
  // Ensure testimonials is an array
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];
  
  // If no testimonials, don't render the component
  if (safeTestimonials.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
      
      <div className="space-y-4">
        {safeTestimonials.slice(0, 3).map((testimonial, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className={`${isMobile ? 'p-3' : 'p-4'} flex items-start gap-3`}>
              {testimonial.avatar_url ? (
                <img 
                  src={testimonial.avatar_url} 
                  alt={testimonial.user_name} 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  {testimonial.user_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-medium">{testimonial.user_name}</h3>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={isMobile ? 14 : 16} 
                        className={i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{testimonial.comment}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;
