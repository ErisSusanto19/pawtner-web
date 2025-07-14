import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ReviewCard from '../ReviewCard';

vi.mock('../StarRating', () => ({
  default: ({ rating }) => <div data-testid="star-rating">Rating: {rating}</div>,
}));

vi.mock('@/assets/undraw_male-avatar_zkzx.svg', () => ({
  default: 'default-avatar.svg',
}));

describe('ReviewCard', () => {
  const mockReview = {
    id: 'rev1',
    user: {
      name: 'Budi Doremi',
      imageUrl: 'https://example.com/budi.jpg',
    },
    rating: 5,
    comment: 'Pelayanannya sangat memuaskan dan produknya berkualitas tinggi!',
    createdAt: '2023-10-27T10:30:00Z',
  };

  it('seharusnya tidak merender apapun jika prop review tidak disediakan', () => {
    const { container } = render(<ReviewCard review={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('seharusnya merender detail ulasan dengan benar', () => {
    render(<ReviewCard review={mockReview} />);

    expect(screen.getByText('Budi Doremi')).toBeInTheDocument();

    expect(screen.getByText(/27 October 2023, \d{2}:\d{2}/)).toBeInTheDocument();

    expect(screen.getByText('Pelayanannya sangat memuaskan dan produknya berkualitas tinggi!')).toBeInTheDocument();

    const starRating = screen.getByTestId('star-rating');
    expect(starRating).toBeInTheDocument();
    expect(starRating).toHaveTextContent('Rating: 5');
  });

  it('seharusnya merender "Anonymous" jika nama pengguna tidak ada', () => {
    const reviewWithoutUserName = {
      ...mockReview,
      user: {
        imageUrl: 'https://example.com/budi.jpg',
      },
    };
    render(<ReviewCard review={reviewWithoutUserName} />);
    expect(screen.getByText('Anonymous')).toBeInTheDocument();
  });

  describe('UserAvatar in ReviewCard', () => {
    it('seharusnya merender gambar pengguna jika imageUrl tersedia', () => {
      render(<ReviewCard review={mockReview} />);
      const avatarImage = screen.getByAltText('Budi Doremi');
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage.src).toBe(mockReview.user.imageUrl);
    });

    it('seharusnya merender avatar default jika imageUrl tidak tersedia', () => {
      const reviewWithoutImage = {
        ...mockReview,
        user: {
          name: 'Budi Doremi',
          imageUrl: null,
        },
      };
      render(<ReviewCard review={reviewWithoutImage} />);
      const avatarImage = screen.getByAltText('Budi Doremi');
      expect(avatarImage).toBeInTheDocument();
      expect(avatarImage.src).toContain('default-avatar.svg');
    });

    it('seharusnya menggunakan "User" sebagai alt text jika nama pengguna juga tidak ada', () => {
        const reviewWithoutUser = {
            ...mockReview,
            user: {}
        }
        render(<ReviewCard review={reviewWithoutUser} />);
        const avatarImage = screen.getByAltText('User');
        expect(avatarImage).toBeInTheDocument();
    })
  });
});