
import { TestimonialCard } from "./TestimonialCard";

interface Testimonial {
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
    <div className="mt-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <span className="text-sm text-gray-500">{testimonials.length} comentários</span>
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
