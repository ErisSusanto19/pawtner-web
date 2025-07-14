import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminSidebarNav from '../AdminSidebarNav';

vi.mock('lucide-react', () => ({
  LayoutDashboard: () => <div data-testid="icon-dashboard" />,
  Users: () => <div data-testid="icon-users" />,
  Building: () => <div data-testid="icon-building" />,
  LogOut: () => <div data-testid="icon-logout" />,
  AlertTriangle: () => <div data-testid="icon-alert" />,
  X: () => <div data-testid="icon-x" />, 
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return { ...original, useNavigate: () => mockNavigate };
});

const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../store/slices/adminAuthSlice', () => ({
  logoutAdmin: vi.fn(),
}));

describe('AdminSidebarNav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <AdminSidebarNav />
      </MemoryRouter>
    );
  };

  it('should render all navigation links and the sign out button', () => {
    renderComponent();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('should not show the confirmation modal on initial render', () => {
    renderComponent();
    expect(screen.queryByRole('heading', { name: /confirm sign out/i })).not.toBeInTheDocument();
  });

  it('should open the confirmation modal when the sign out button is clicked', async () => {
    renderComponent();
    const signOutButton = screen.getByRole('button', { name: /sign out/i });
    
    await act(() => fireEvent.click(signOutButton));
    
    expect(await screen.findByRole('heading', { name: /confirm sign out/i })).toBeInTheDocument();
  });

  it('should dispatch logout action and navigate on logout confirmation', async () => {
    renderComponent();
    const signOutButton = screen.getByRole('button', { name: /sign out/i });

    await act(() => fireEvent.click(signOutButton));
    
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });

    await act(() => fireEvent.click(confirmButton));

    // Assert that dispatch was called once
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    // Assert that dispatch was called WITH A FUNCTION (a thunk).
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login');

    expect(screen.queryByRole('heading', { name: /confirm sign out/i })).not.toBeInTheDocument();
  });
});