import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Sidebar from '../Sidebar';

vi.mock('../ConfirmationModal', () => ({
  default: ({ isOpen, onConfirm, onClose, title, message }) =>
    isOpen ? (
      <div data-testid="confirmation-modal">
        <h1>{title}</h1>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
}));

vi.mock('../assets/W.png', () => ({
  default: 'pawtner-logo.png',
}));

const mockStore = configureStore([]);
const store = mockStore({});

const renderWithProviders = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  return {
    user: userEvent.setup(),
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </Provider>
    ),
  };
};

describe('Sidebar Component', () => {
  it('should render the logo, title, and all menu items by default', () => {
    renderWithProviders(<Sidebar menuDisabled={false} />);

    expect(screen.getByAltText('Pawtner Logo')).toBeInTheDocument();
    expect(screen.getByText('Pawtner')).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /orders/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /services/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /bookings/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /payments/i })).toBeInTheDocument();
    
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('should only render allowed menu items when menu is disabled', () => {
    renderWithProviders(<Sidebar menuDisabled={true} />);

    // Items that should be visible
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /settings/i })).toBeInTheDocument();

    // Items that should NOT be visible
    expect(screen.queryByRole('link', { name: /products/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /orders/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /services/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /bookings/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /payments/i })).not.toBeInTheDocument();
  });

  it('should apply an active style to the current route link', () => {
    renderWithProviders(<Sidebar menuDisabled={false} />, { route: '/products' });

    const productsLink = screen.getByRole('link', { name: /products/i });
    const dashboardLink = screen.getByRole('link', { name: /dashboard/i });

    expect(productsLink).toHaveAttribute('aria-current', 'page');
    expect(dashboardLink).not.toHaveAttribute('aria-current', 'page');
  });

  it('should open the logout modal when the sign out button is clicked', async () => {
    const { user } = renderWithProviders(<Sidebar />);
    
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    const modal = await screen.findByTestId('confirmation-modal');
    expect(modal).toBeInTheDocument();
    expect(screen.getByText('Confirm Sign Out')).toBeInTheDocument();
  });

  it('should call onLogout and close the modal when logout is confirmed', async () => {
    const onLogoutMock = vi.fn();
    const { user } = renderWithProviders(<Sidebar onLogout={onLogoutMock} />);

    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    await user.click(signOutButton);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await user.click(confirmButton);

    expect(onLogoutMock).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(screen.queryByTestId('confirmation-modal')).not.toBeInTheDocument();
    });
  });
});