import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import RegisterAccountPage from '../RegisterAccountPage';
import { toast } from 'react-toastify';

// --- MOCKS ---
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: vi.fn((selector) => selector({
    auth: { isLoading: false, error: null, message: null },
  })),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('lucide-react', () => ({
  UserRound: () => 'UserIcon',
  MapPin: () => 'MapIcon',
  Eye: () => 'EyeIcon',
  EyeOff: () => 'EyeOffIcon',
}));

vi.mock('../../../store/slices/authSlice', () => ({
    registerUser: (userData) => ({ type: 'auth/registerUser', payload: userData }),
}));


// --- TESTS ---
describe('RegisterAccountPage', () => {
  let user;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterAccountPage />
      </MemoryRouter>
    );
  });

  it('should render the form correctly with submit button disabled', () => {
    expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  it('should show a validation error if passwords do not match', async () => {
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password-salah');
    
    const errorMessage = await screen.findByText("Passwords don't match");
    expect(errorMessage).toBeInTheDocument();
  });

  it('should enable button, dispatch registerUser, and navigate on successful submission', async () => {
    mockDispatch.mockResolvedValue({ meta: { requestStatus: 'fulfilled' } });

    await user.type(screen.getByLabelText(/Full Name/i), 'Budi Santoso');
    await user.type(screen.getByLabelText(/Email/i), 'budi.santoso@example.com');
    await user.type(screen.getByLabelText(/Phone/i), '081234567890');
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await waitFor(() => expect(signUpButton).toBeEnabled());

    await user.click(signUpButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(vi.mocked(toast.success)).toHaveBeenCalledWith("Signed up successfully");
      expect(mockNavigate).toHaveBeenCalledWith('/verify-email', {
        state: { email: 'budi.santoso@example.com' },
      });
    });
  });

  it('should show a toast error on failed submission', async () => {
    const errorMessage = "Phone number is already in use.";
    mockDispatch.mockRejectedValue(new Error(errorMessage));

    await user.type(screen.getByLabelText(/Full Name/i), 'Budi Santoso');
    await user.type(screen.getByLabelText(/Email/i), 'budi.santoso@example.com');
    await user.type(screen.getByLabelText(/Phone/i), '081234567890');
    // PERBAIKAN: Gunakan regex untuk mengetik di kolom password
    await user.type(screen.getByLabelText(/^Password/i), 'password123');
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');
    
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await waitFor(() => expect(signUpButton).toBeEnabled());
    
    await user.click(signUpButton);

    await waitFor(() => {
      expect(vi.mocked(toast.error)).toHaveBeenCalledWith(expect.stringContaining(errorMessage));
    });
  });
});