
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  rating,
  comment,
  avatarUrl
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start">
        {avatarUrl && (
          <div className="mr-3 flex-shrink-0">
            <img 
              src={avatarUrl} 
              alt={name} 
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{name}</h4>
          <div className="flex items-center my-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                className={`${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
