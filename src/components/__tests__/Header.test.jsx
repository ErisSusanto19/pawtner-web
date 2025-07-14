import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Header from '../Header';

vi.mock('../ConfirmationModal', () => ({
  default: ({ isOpen, onClose, onConfirm, title, message }) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h1>{title}</h1>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

const mockStore = configureStore([]);
const initialState = {
  auth: {
    user: {
      name: 'Budi Test',
      email: 'budi.test@example.com',
      imageUrl: 'https://example.com/avatar.jpg',
    },
  },
};
const store = mockStore(initialState);

const renderWithProviders = (ui, { reduxStore = store } = {}) => {
  return {
    user: userEvent.setup(),
    ...render(
      <Provider store={reduxStore}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>
    ),
  };
};

describe('Header Component', () => {
  it('should render the title correctly', () => {
    renderWithProviders(<Header title="Dashboard" />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('should display user information from the Redux store', () => {
    renderWithProviders(<Header title="Test" />);
    expect(screen.getByText('Budi Test')).toBeInTheDocument();
    expect(screen.getByText('budi.test@example.com')).toBeInTheDocument();
  });

  it('should open and close the profile dropdown when the user button is clicked', async () => {
    const { user } = renderWithProviders(<Header title="Test" />);
    const userButton = screen.getByRole('button', { name: /budi test/i });

    expect(screen.queryByText(/your profile/i)).not.toBeInTheDocument();

    await user.click(userButton);
    expect(screen.getByText(/your profile/i)).toBeInTheDocument();

    await user.click(userButton);
    expect(screen.queryByText(/your profile/i)).not.toBeInTheDocument();
  });

  it('should call setSidebarOpen when the menu button is clicked (mobile view)', async () => {
    const setSidebarOpenMock = vi.fn();
    const { user } = renderWithProviders(<Header title="Test" setSidebarOpen={setSidebarOpenMock} />);

    const menuButton = screen.getByRole('button', { name: /open sidebar/i });
    await user.click(menuButton);

    expect(setSidebarOpenMock).toHaveBeenCalledTimes(1);
    expect(setSidebarOpenMock).toHaveBeenCalledWith(true);
  });

  it('should open the logout confirmation modal when the "Sign out" button is clicked', async () => {
    const { user } = renderWithProviders(<Header title="Test" />);
    const userButton = screen.getByRole('button', { name: /budi test/i });

    await user.click(userButton);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    // Assert that the modal is visible by waiting for it
    await waitFor(() => {
      expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
    });

    expect(screen.getByText('Confirm Sign Out')).toBeInTheDocument();
  });

  it('should call the onLogout function when logout is confirmed', async () => {
    const onLogoutMock = vi.fn();
    const { user } = renderWithProviders(<Header title="Test" onLogout={onLogoutMock} />);

    // Open dropdown
    const userButton = screen.getByRole('button', { name: /budi test/i });
    await user.click(userButton);

    // Open modal
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    // Wait for the modal and then find the confirm button inside it
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    // Assert that the onLogout function was called
    expect(onLogoutMock).toHaveBeenCalledTimes(1);

    // Assert that the modal is closed after confirmation
    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
    });
  });

  it('should close the dropdown when clicking the "Your Profile" link', async () => {
    const { user } = renderWithProviders(<Header title="Test" />);
    const userButton = screen.getByRole('button', { name: /budi test/i });

    await user.click(userButton);
    expect(screen.getByText(/your profile/i)).toBeInTheDocument();

    const profileLink = screen.getByRole('link', { name: /your profile/i });
    await user.click(profileLink);

    expect(screen.queryByText(/your profile/i)).not.toBeInTheDocument();
  });
});