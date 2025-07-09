import StarRating from './StarRating';
import { format } from 'date-fns';
import { MoreVertical } from 'lucide-react'; 

const UserAvatar = ({ user }) => {
    const initials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '?';
    return (
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 font-bold">
            {initials}
        </div>
    );
};

const ReviewCard = ({ review }) => {
    if (!review) return null;

    return (
        <div className="flex gap-4 py-4 border-b border-gray-200 last:border-b-0">
            <div className="flex-shrink-0">
                <UserAvatar user={review.user} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                    <div>
                        <p className="font-semibold text-gray-800">{review.user?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">
                            {format(new Date(review.createdAt), 'dd MMMM yyyy, HH:mm')}
                        </p>
                    </div>
                    {/* <button 
                        className="p-1 text-gray-500 hover:bg-gray-200 rounded-full focus:outline-none"
                        title="Review options"
                        // onClick={() => handleOpenMenu(review.id)}
                    >
                        <MoreVertical size={18} />
                    </button> */}
                </div>
                <StarRating rating={review.rating} className="my-2" />
                <p className="text-gray-600 text-sm leading-relaxed">
                    {review.comment}
                </p>
            </div>
        </div>
    );
};

export default ReviewCard;