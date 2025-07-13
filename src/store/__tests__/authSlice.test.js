import { describe, it, expect } from 'vitest';
import authReducer, {
  authOperationStart,
  authOperationFail,
  loginSuccess,
  logoutSuccess,
  updateUserProfileSuccess,
} from '../slices/authSlice';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  message: null,
  status: 'idle',
  isProfileUpdating: false,
  isPasswordChanging: false,
};

describe('authSlice reducers', () => {
  it('should return the initial state', () => {

    expect(authReducer(undefined, { type: 'unknown' })).toEqual({
      ...initialState,
      user: JSON.parse(localStorage.getItem('user')) || null,
      token: localStorage.getItem('token') || null,
      isAuthenticated: !!localStorage.getItem('token'),
    });
  });

  it('should handle authOperationStart', () => {
    const nextState = authReducer(initialState, authOperationStart());
    expect(nextState.isLoading).toBe(true);
    expect(nextState.status).toBe('loading');
    expect(nextState.error).toBeNull();
  });

  it('should handle authOperationFail', () => {
    const errorPayload = { error: 'Something went wrong' };
    const nextState = authReducer(initialState, authOperationFail(errorPayload));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.status).toBe('failed');
    expect(nextState.error).toBe('Something went wrong');
  });

  it('should handle loginSuccess', () => {
    const loginPayload = {
      user: { id: 1, name: 'Test User', email: 'test@example.com' },
      token: 'fake-jwt-token',
    };
    const nextState = authReducer(initialState, loginSuccess(loginPayload));
    expect(nextState.isAuthenticated).toBe(true);
    expect(nextState.user).toEqual(loginPayload.user);
    expect(nextState.token).toBe(loginPayload.token);
    expect(nextState.status).toBe('succeeded');
    expect(nextState.isLoading).toBe(false);
  });

  it('should handle logoutSuccess', () => {
    const loggedInState = {
      ...initialState,
      isAuthenticated: true,
      user: { id: 1, name: 'Test User' },
      token: 'fake-jwt-token',
    };
    const nextState = authReducer(loggedInState, logoutSuccess());
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.user).toBeNull();
    expect(nextState.token).toBeNull();
  });

  it('should handle updateUserProfileSuccess', () => {
    const initialProfileState = {
      ...initialState,
      isAuthenticated: true,
      user: { id: 1, name: 'Old Name', email: 'test@example.com' },
    };
    const updatePayload = {
      user: { name: 'New Name' },
    };
    const nextState = authReducer(initialProfileState, updateUserProfileSuccess(updatePayload));
    expect(nextState.user.name).toBe('New Name');
    expect(nextState.user.email).toBe('test@example.com'); // Pastikan data lain tidak hilang
    expect(nextState.isProfileUpdating).toBe(false);
  });
});
