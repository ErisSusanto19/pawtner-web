import StarRating from '../../../components/StarRating';
import ReviewCard from '../../../components/ReviewCard';

const ServiceReviews = ({ reviews = [], averageRating = 0, reviewCount = 0 }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-[#E9ECEF] p-6">

            <h2 className="text-xl font-bold text-[#495057] mb-4">
                Reviews ({reviewCount})
            </h2>

            {reviewCount > 0 && (
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-md border">
                    <div className="text-4xl font-bold text-[#545F71]">
                        {averageRating.toFixed(1)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-700">Average Rating</p>
                        <StarRating rating={averageRating} size={20} className="mt-1"/>
                    </div>
                </div>
            )}

            <div>
                {reviewCount > 0 ? (
                    reviews.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))
                ) : (
                    <div className="text-center py-10 border border-dashed rounded-md">
                        <p className="text-gray-600 font-medium">No Reviews Submitted</p>
                        <p className="text-sm text-gray-400 mt-1">This service currently has no customer reviews.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceReviews;