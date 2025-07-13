import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles onClick event', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Click Me</Button>);
    const button = screen.getByText('Click Me');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies the correct classes for secondary variant', () => {
    render(<Button secondary>Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-[#BAC0CA]');
  });

  it('applies the correct classes for danger variant', () => {
    render(<Button danger>Danger</Button>);
    const button = screen.getByText('Danger');
    expect(button).toHaveClass('bg-rose-500');
  });

  it('applies fullWidth class when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByText('Full Width');
    expect(button).toHaveClass('w-full');
  });

  it('shows a spinner when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    // We need to find the spinner. Let's assume the Spinner component renders a div with role="status".
    // This might need adjustment if the Spinner component is different.
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
