import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import AdminHeader from '../AdminHeader';

vi.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
}));

vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

// --- Test Suite ---

describe('AdminHeader Component', () => {

  beforeEach(() => {
    useSelector.mockClear();
  });

  it('should render the title and user icon correctly', () => {
    useSelector.mockReturnValue(null);

    // Act
    render(<AdminHeader title="Dashboard" />);

    // Assert
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByTestId('user-icon')).toBeInTheDocument();
  });

  it('should display the admin name when an admin is logged in', () => {
    // Arrange: Define the mock admin data and configure useSelector to return it
    const mockAdmin = {
      id: 'admin123',
      name: 'Budi Doremi',
      email: 'budi.doremi@example.com',
    };
    useSelector.mockReturnValue(mockAdmin);

    // Act
    render(<AdminHeader title="Admin Profile" />);

    // Assert
    expect(screen.getByText('Budi Doremi')).toBeInTheDocument();
    // Also, ensure the fallback text is NOT present
    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });

  it('should display "Admin" as a fallback when no admin is found in state', () => {
    // Arrange: Configure useSelector to return null, simulating a logged-out state
    useSelector.mockReturnValue(null);

    // Act
    render(<AdminHeader title="Settings" />);

    // Assert
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('should still display "Admin" as a fallback if the admin object has no name', () => {
    // Arrange: Simulate a state where the admin object is present but lacks a 'name' property
    const mockAdminWithoutName = {
      id: 'admin456',
      email: 'no.name@example.com',
    };
    useSelector.mockReturnValue(mockAdminWithoutName);

    // Act
    render(<AdminHeader title="User Management" />);

    // Assert
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });
});