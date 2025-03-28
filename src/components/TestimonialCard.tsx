
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TestimonialType {
  id: string;
  user_name: string;
  comment: string;
  rating: number;
  avatar_url?: string;
  created_at?: string;
}

const TestimonialCard = ({ 
  user_name, 
  comment, 
  rating,
  avatar_url = "/lovable-uploads/5bdb8fb7-f326-419c-9013-3ab40582ff09.png", 
  created_at 
}: Omit<TestimonialType, 'id'>) => {
  return (
    <div className="border rounded-md p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img 
            src={avatar_url} 
            alt={user_name} 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{user_name}</h4>
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
