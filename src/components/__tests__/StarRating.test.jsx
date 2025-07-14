import { render } from '@testing-library/react';
import StarRating from '../StarRating';

describe('StarRating', () => {
  it('should render the correct number of total stars', () => {
    const { container } = render(<StarRating rating={3} totalStars={5} />);
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBe(5);
  });

  it('should fill the correct number of stars based on the rating', () => {
    const rating = 3;
    const { container } = render(<StarRating rating={rating} totalStars={5} />);
    const stars = container.querySelectorAll('svg');
    stars.forEach((star, index) => {
      if (index < rating) {
        expect(star).toHaveClass('text-yellow-400', 'fill-current');
      } else {
        expect(star).toHaveClass('text-gray-300');
      }
    });
  });

  it('should handle a rating of 0', () => {
    const { container } = render(<StarRating rating={0} totalStars={5} />);
    const stars = container.querySelectorAll('svg');
    stars.forEach(star => {
      expect(star).toHaveClass('text-gray-300');
    });
  });

  it('should handle a rating equal to totalStars', () => {
    const { container } = render(<StarRating rating={5} totalStars={5} />);
    const stars = container.querySelectorAll('svg');
    stars.forEach(star => {
      expect(star).toHaveClass('text-yellow-400', 'fill-current');
    });
  });
});