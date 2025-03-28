
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface TestimonialCardProps {
  name?: string;
  user_name?: string;
  rating: number;
  comment: string;
  avatarUrl?: string;
  avatar_url?: string;
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
    <div className="border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
      <div className="flex items-start">
        {displayAvatarUrl && (
          <div className="mr-3 flex-shrink-0">
            <img 
              src={displayAvatarUrl} 
              alt={displayName} 
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-sm">{displayName}</h4>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2">Foi útil?</span>
              <button className="ml-1 text-gray-400 hover:text-blue-500">
                <ThumbsUp size={14} />
              </button>
              <button className="ml-1 text-gray-400 hover:text-red-500">
                <ThumbsDown size={14} />
              </button>
            </div>
          </div>
          <div className="flex items-center my-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span 
                key={i} 
                className={`text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-600">{comment}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
