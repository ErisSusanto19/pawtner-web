import { describe, it, expect, vi, beforeEach } from 'vitest';
import authReducer, {
  authOperationStart,
  authOperationFail,
  loginSuccess,
  updateUserBusinessStatus,
  logoutSuccess,
  updateUserProfileSuccess,
  registerSuccess,
  fetchProfileSuccess,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFail,
  updateProfileStart,
  loginUser,
  registerUser,
  logout,
  updateUserProfile,
  checkUserSession,
} from '../slices/authSlice';

import * as authApi from '../../api/authApi';
import * as businessSlice from '../slices/businessSlice';

vi.mock('../../api/authApi');
vi.mock('../slices/businessSlice', () => ({
  fetchMyBusiness: vi.fn(),
  clearBusinessData: vi.fn(),
}));

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
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'setItem').mockClear();
    vi.spyOn(Storage.prototype, 'removeItem').mockClear();
  });

  it('should return the initial state from localStorage', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      if (key === 'user') return JSON.stringify({ id: 1, name: 'Stored User' });
      if (key === 'token') return 'stored-token';
      return null;
    });

    vi.resetModules();

    const { default: authReducerWithMockedStorage } = await import('../slices/authSlice');
    const state = authReducerWithMockedStorage(undefined, { type: 'unknown' });

    expect(state.user.name).toBe('Stored User');
    expect(state.token).toBe('stored-token');
    expect(state.isAuthenticated).toBe(true);

    vi.restoreAllMocks();
  });

  it('should handle authOperationStart', () => {
    const state = authReducer(initialState, authOperationStart());
    expect(state.isLoading).toBe(true);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle loginSuccess', () => {
    const payload = { user: { id: 1 }, token: 'abc' };
    const state = authReducer(initialState, loginSuccess(payload));
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(payload.user);
    expect(state.token).toBe(payload.token);
  });

  it('should handle logoutSuccess', () => {
    const loggedInState = { ...initialState, isAuthenticated: true, user: {id:1}, token: 'abc' };
    const state = authReducer(loggedInState, logoutSuccess());
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('should handle updateUserProfileSuccess by merging data', () => {
    const prevState = { ...initialState, user: { id: 1, name: 'Old', email: 'a@b.com' } };
    const payload = { user: { name: 'New' } };
    const state = authReducer(prevState, updateUserProfileSuccess(payload));
    expect(state.user.name).toBe('New');
    expect(state.user.email).toBe('a@b.com');
  });

  it('should handle authOperationFail', () => {
    const errorPayload = { error: 'Invalid operation' };
    const state = authReducer({ ...initialState, isLoading: true }, authOperationFail(errorPayload));
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Invalid operation');
  });

  it('should handle the full password change cycle', () => {
    let state = authReducer(initialState, changePasswordStart());
    expect(state.isPasswordChanging).toBe(true);
    expect(state.error).toBeNull();
    
    state = authReducer(state, changePasswordSuccess());
    expect(state.isPasswordChanging).toBe(false);
    expect(state.message).toBe("Password changed successfully!");

    state = authReducer(initialState, changePasswordStart()); // Reset for failure test
    const errorPayload = { error: 'Wrong old password' };
    state = authReducer(state, changePasswordFail(errorPayload));
    expect(state.isPasswordChanging).toBe(false);
    expect(state.error).toBe('Wrong old password');
  });

});


describe('authSlice thunks', () => {
  const dispatch = vi.fn();
  let getState;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, 'setItem').mockClear();
    vi.spyOn(Storage.prototype, 'removeItem').mockClear();
    
    dispatch.mockImplementation((action) => {
        if (typeof action === 'function') {
            return action(dispatch, getState);
        }
        return action;
    });
  });

  describe('loginUser', () => {
    const credentials = { email: 'test@test.com', password: 'password' };
    const loginResponse = { data: { token: 'jwt-token', userId: 'user-1' } };
    const profileResponse = { data: { id: 'user-1', name: 'Test User', hasBusiness: false } };

    it('should perform login, fetch profile, and fetch business successfully', async () => {

      getState = vi.fn().mockReturnValue({
        auth: initialState,
        business: { details: { id: 'biz-1' } }
      });
      
      authApi.login.mockResolvedValue(loginResponse);
      authApi.getProfile.mockResolvedValue(profileResponse);
      
      await loginUser(credentials)(dispatch, getState);

      // Verifikasi urutan
      expect(dispatch).toHaveBeenCalledWith(authOperationStart());
      expect(authApi.login).toHaveBeenCalledWith(credentials);
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'jwt-token');
      expect(authApi.getProfile).toHaveBeenCalledWith('user-1');
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(profileResponse.data));
      expect(dispatch).toHaveBeenCalledWith(loginSuccess({ user: profileResponse.data, token: 'jwt-token' }));
      expect(businessSlice.fetchMyBusiness).toHaveBeenCalled();
    
      expect(dispatch).toHaveBeenCalledWith(updateUserBusinessStatus(true))
    });

    it('should handle login failure and clear storage', async () => {
        const errorMessage = 'Invalid credentials';
        authApi.login.mockRejectedValue({ response: { data: { message: errorMessage } } });

        await expect(loginUser(credentials)(dispatch, getState)).rejects.toThrow(errorMessage);

        expect(dispatch).toHaveBeenCalledWith(authOperationFail({ error: errorMessage }));
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
        expect(authApi.getProfile).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should clear all relevant storage and dispatch success actions', () => {
      logout()(dispatch);

      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
      expect(localStorage.removeItem).toHaveBeenCalledWith('businessDetails');
      expect(dispatch).toHaveBeenCalledWith(logoutSuccess());

      expect(dispatch).toHaveBeenCalledWith(businessSlice.clearBusinessData());
    });
  });

  describe('updateUserProfile', () => {
    it('should send FormData and dispatch success with merged user data', async () => {
      const formData = { name: 'New Name', imageUrl: 'image.png' };
      const currentUser = { id: 'user-1', name: 'Old Name' };
      const apiResponse = { data: { name: 'New Name', profileImageUrl: 'url.com/image.png' } };

      getState = vi.fn().mockReturnValue({ auth: { user: currentUser } });
      authApi.updateProfile.mockResolvedValue(apiResponse);

      await updateUserProfile(formData)(dispatch, getState);

      const expectedNewUserData = { ...currentUser, ...apiResponse.data };

      expect(dispatch).toHaveBeenCalledWith(updateProfileStart());
      expect(authApi.updateProfile).toHaveBeenCalledWith(expect.any(FormData));
      expect(dispatch).toHaveBeenCalledWith(updateUserProfileSuccess({ user: expectedNewUserData }));
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(expectedNewUserData));
    });
  });

  describe('registerUser', () => {
    it('should dispatch registerSuccess on successful registration', async () => {
      const userData = { email: 'new@user.com', password: 'password' };
      const response = { message: 'Registration successful' };
      authApi.register.mockResolvedValue(response);
      getState = vi.fn().mockReturnValue({ auth: initialState });

      await registerUser(userData)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(authOperationStart());
      expect(authApi.register).toHaveBeenCalledWith(userData);
      expect(dispatch).toHaveBeenCalledWith(registerSuccess({ message: response.message }));
    });
  });

  describe('checkUserSession', () => {
    it('should dispatch loginSuccess if token and profile are valid', async () => {
      const user = { id: 'user-1' };
      const token = 'valid-token';
      const profileResponse = { data: { id: 'user-1', name: 'Session User' } };

      getState = vi.fn().mockReturnValue({ auth: { user, token }, business: {} });
      authApi.getProfile.mockResolvedValue(profileResponse);

      await checkUserSession()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(authOperationStart());
      expect(authApi.getProfile).toHaveBeenCalledWith(user.id);
      expect(dispatch).toHaveBeenCalledWith(loginSuccess({ user: profileResponse.data, token }));
    });

    it('should dispatch logout if session check fails', async () => {
      const user = { id: 'user-1' };
      const token = 'invalid-token';
      const errorMessage = 'Session expired';
      
      getState = vi.fn().mockReturnValue({ auth: { user, token } });
      authApi.getProfile.mockRejectedValue({ response: { status: 401, data: { message: errorMessage } } });

      await expect(checkUserSession()(dispatch, getState)).rejects.toThrow(errorMessage);

      expect(dispatch).toHaveBeenCalledWith(authOperationFail({ error: errorMessage }));
      expect(dispatch).toHaveBeenCalledWith(logoutSuccess()); 
    });
  });
});