import { Star } from 'lucide-react';
import clsx from 'clsx';

const StarRating = ({ rating = 0, totalStars = 5, size = 16, className }) => {
    const fullStars = Math.floor(rating);
    
    return (
        <div className={clsx("flex items-center", className)}>
            {[...Array(totalStars)].map((_, index) => (
                <Star
                    key={index}
                    size={size}
                    className={clsx(
                        "transition-colors",
                        index < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    )}
                />
            ))}
        </div>
    )
}

export default StarRating