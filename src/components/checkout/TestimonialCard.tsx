
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name?: string;
  user_name?: string; // Added to support both property names
  rating: number;
  comment: string;
  avatarUrl?: string;
  avatar_url?: string; // Added to support both property names
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  user_name,
  rating,
  comment,
  avatarUrl,
  avatar_url
}) => {
  // Use either name or user_name, prioritizing name if both are provided
  const displayName = name || user_name || "";
  // Use either avatarUrl or avatar_url, prioritizing avatarUrl if both are provided
  const displayAvatarUrl = avatarUrl || avatar_url;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start">
        {displayAvatarUrl && (
          <div className="mr-3 flex-shrink-0">
            <img 
              src={displayAvatarUrl} 
              alt={displayName} 
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <h4 className="font-medium text-sm">{displayName}</h4>
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
