
import React from 'react';
import { TestimonialCard } from "./TestimonialCard";

export interface Testimonial {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  avatar_url?: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
  title?: string;
}

export default function TestimonialsSection({ 
  testimonials, 
  title = "Depoimentos" 
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-medium mb-2 flex items-center">
          {title}
        </h2>
        <span className="text-xs text-gray-500">{testimonials.length} comentários</span>
      </div>
      
      <div className="space-y-4">
        {testimonials.map(testimonial => (
          <TestimonialCard
            key={testimonial.id}
            name={testimonial.user_name}
            rating={testimonial.rating}
            comment={testimonial.comment}
            avatarUrl={testimonial.avatar_url}
          />
        ))}
      </div>
    </div>
  );
}
