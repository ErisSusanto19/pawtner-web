
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import adminAuthReducer, {
  adminOperationStart,
  adminOperationFail,
  adminLoginSuccess,
  adminLogoutSuccess,
  clearAdminError,
  loginAdmin,
  logoutAdmin,
} from '../slices/adminAuthSlice';
import * as adminApi from '../../api/adminAuthApi';

vi.mock('../../api/adminAuthApi');

const initialState = {
  admin: null,
  adminToken: null,
  isAdminAuthenticated: false,
  isLoading: false,
  error: null,
  status: 'idle',
};

describe('adminAuthSlice reducers', () => {
  it('should return the initial state', () => {
    expect(adminAuthReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle adminOperationStart', () => {
    const nextState = adminAuthReducer(initialState, adminOperationStart());
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBeNull();
    expect(nextState.status).toBe('loading');
  });

  it('should handle adminOperationFail', () => {
    const error = 'Something went wrong';
    const nextState = adminAuthReducer(initialState, adminOperationFail({ error }));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toBe(error);
    expect(nextState.status).toBe('failed');
  });

  it('should handle adminLoginSuccess', () => {
    const adminDetails = { name: 'Admin' };
    const adminToken = 'admin-token';
    const nextState = adminAuthReducer(initialState, adminLoginSuccess({ adminDetails, adminToken }));
    expect(nextState.isLoading).toBe(false);
    expect(nextState.isAdminAuthenticated).toBe(true);
    expect(nextState.admin).toEqual(adminDetails);
    expect(nextState.adminToken).toBe(adminToken);
    expect(nextState.error).toBeNull();
    expect(nextState.status).toBe('succeeded');
  });

  it('should handle adminLogoutSuccess', () => {
    const state = {
      ...initialState,
      admin: { name: 'Admin' },
      adminToken: 'admin-token', // Pastikan menggunakan nama state yang benar
      isAdminAuthenticated: true,
    };
    const nextState = adminAuthReducer(state, adminLogoutSuccess());
    expect(nextState.admin).toBeNull();
    expect(nextState.adminToken).toBeNull();
    expect(nextState.isAdminAuthenticated).toBe(false)
  });

  it('should handle clearAdminError', () => {
    const state = { ...initialState, error: 'An error' };
    const nextState = adminAuthReducer(state, clearAdminError());
    expect(nextState.error).toBeNull();
  });
});

describe('adminAuthSlice thunks', () => {
  let dispatch;

  beforeEach(() => {
    dispatch = vi.fn();
    // Mock localStorage
    global.Storage.prototype.setItem = vi.fn();
    global.Storage.prototype.removeItem = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('loginAdmin', () => {
    it('should dispatch adminLoginSuccess on successful login', async () => {
      const credentials = { email: 'admin@example.com', password: 'password' };

      const responseData = { data: { name: 'Admin', id: 1, token: 'admin-token' } };
      adminApi.loginAdmin.mockResolvedValue(responseData);
      const expectedToken = 'admin-token';
      const expectedAdminDetails = { name: 'Admin', id: 1 };

      await loginAdmin(credentials)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(adminOperationStart());
      expect(localStorage.setItem).toHaveBeenCalledWith('adminToken', expectedToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('adminDetails', JSON.stringify(expectedAdminDetails));
      expect(dispatch).toHaveBeenCalledWith(adminLoginSuccess({ adminDetails: expectedAdminDetails, adminToken: expectedToken }));
    });

    it('should dispatch adminOperationFail on failed login', async () => {
      const credentials = { email: 'admin@example.com', password: 'password' };
      const error = new Error('Admin login failed.');
      adminApi.loginAdmin.mockRejectedValue(error);

      await expect(loginAdmin(credentials)(dispatch)).rejects.toThrow(error);

      expect(dispatch).toHaveBeenCalledWith(adminOperationStart());
      expect(dispatch).toHaveBeenCalledWith(adminOperationFail({ error: error.message }));
    });
  });

  describe('logoutAdmin', () => {
    it('should dispatch adminLogoutSuccess and clear localStorage', () => {
      logoutAdmin()(dispatch);

      expect(localStorage.removeItem).toHaveBeenCalledWith('adminToken');
      expect(localStorage.removeItem).toHaveBeenCalledWith('adminDetails');
      expect(dispatch).toHaveBeenCalledWith(adminLogoutSuccess());
    });
  });
});
