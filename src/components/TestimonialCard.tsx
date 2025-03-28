
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  name?: string;
  user_name?: string; // Added to support both property names
  comment: string;
  rating: number;
  avatarUrl?: string;
  avatar_url?: string; // Added to support both property names
  created_at?: string;
}

const TestimonialCard = ({ 
  name, 
  user_name,
  comment, 
  rating,
  avatarUrl,
  avatar_url,
  created_at 
}: TestimonialCardProps) => {
  // Use either name or user_name, prioritizing name if both are provided
  const displayName = name || user_name || "";
  // Use either avatarUrl or avatar_url, prioritizing avatarUrl if both are provided
  const displayAvatarUrl = avatarUrl || avatar_url || "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png";
  
  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img 
            src={displayAvatarUrl} 
            alt={displayName} 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{displayName}</h4>
          <div className="star-rating my-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon 
                key={index} 
                size={14} 
                fill={index < rating ? "gold" : "none"} 
                className={cn(
                  "stroke-yellow-500", 
                  index < rating ? "fill-yellow-500" : "fill-none"
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-700 mt-1">{comment}</p>
          {created_at && <div className="text-xs text-gray-500 mt-2">Em {created_at}</div>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
export { TestimonialCard };
