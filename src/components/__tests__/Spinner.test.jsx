
import { render, screen } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner', () => {
  it('should render with default medium size', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('h-5 w-5'); // default size 'md'
  });

  it('should render with small size', () => {
    render(<Spinner size="sm" />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('h-4 w-4');
  });

  it('should render with large size', () => {
    render(<Spinner size="lg" />);
    const spinnerElement = screen.getByRole('status');
    expect(spinnerElement).toBeInTheDocument();
    expect(spinnerElement).toHaveClass('h-8 w-8');
  });

  it('should have a title for accessibility', () => {
    render(<Spinner />);
    expect(screen.getByTitle('Loading...')).toBeInTheDocument();
  });
});
