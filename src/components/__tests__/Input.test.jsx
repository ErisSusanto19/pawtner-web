import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Input from '../Input';

// Mock untuk react-hook-form
const mockRegister = vi.fn();

describe('Input component', () => {
  // Reset mock sebelum setiap tes
  beforeEach(() => {
    mockRegister.mockClear();
  });

  it('renders with a label', () => {
    render(<Input id="email" label="Email Address" register={mockRegister} errors={{}} />);
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  it('displays a required indicator when rule is set', () => {
    render(<Input id="name" label="Full Name" register={mockRegister} rules={{ required: 'Name is required' }} errors={{}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(screen.getByText('*')).toHaveClass('text-red-500');
  });

  it('renders as disabled when disabled prop is true', () => {
    render(<Input id="username" label="Username" register={mockRegister} errors={{}} disabled />);
    expect(screen.getByLabelText('Username')).toBeDisabled();
  });

  it('displays an error message when there is an error', () => {
    const errors = {
      email: {
        type: 'manual',
        message: 'Invalid email format'
      }
    };
    render(<Input id="email" label="Email" register={mockRegister} errors={errors} />);
    expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    expect(screen.getByText('Invalid email format')).toHaveClass('text-rose-500');
  });

  it('calls register function with the correct id and rules', () => {
    const rules = { required: true, minLength: 2 };
    render(<Input id="test" label="Test" register={mockRegister} rules={rules} errors={{}} />);
    expect(mockRegister).toHaveBeenCalledWith('test', rules);
  });

  describe('password input', () => {
    it('renders a password input with a visibility toggle button', () => {
      render(<Input id="password" label="Password" type="password" register={mockRegister} errors={{}} />);
      expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
      expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
    });

    it('toggles password visibility on button click', () => {
      render(<Input id="password" label="Password" type="password" register={mockRegister} errors={{}} />);
      const passwordInput = screen.getByLabelText('Password');
      const toggleButton = screen.getByRole('button', { name: /show password/i });

      // Initially, password should be hidden
      expect(passwordInput).toHaveAttribute('type', 'password');

      // Click to show password
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();

      // Click to hide password again
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
      expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument();
    });
  });
});
