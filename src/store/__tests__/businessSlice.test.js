import { describe, it, expect, vi, beforeEach } from 'vitest';
import businessReducer, {
  businessOperationStart,
  businessOperationSuccess,
  businessOperationFail,
  clearBusinessData,
} from '../slices/businessSlice';

const initialState = {
  details: null,
  isLoading: false,
  error: null,
  status: 'idle',
};

describe('businessSlice reducers', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'setItem').mockClear();
    vi.spyOn(Storage.prototype, 'removeItem').mockClear();
  });

  it('should return the initial state on first run', () => {
    expect(businessReducer(undefined, { type: 'unknown' })).toEqual({
      ...initialState,
      details: JSON.parse(localStorage.getItem('businessDetails')) || null,
    });
  });

  it('should handle businessOperationStart', () => {
    const state = businessReducer(initialState, businessOperationStart());
    expect(state.isLoading).toBe(true);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle businessOperationSuccess', () => {
    const businessDetailsPayload = {
      businessDetails: { id: 'biz-123', name: 'Pawtner Petshop' },
    };
    const state = businessReducer(initialState, businessOperationSuccess(businessDetailsPayload));

    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('succeeded');
    expect(state.details).toEqual(businessDetailsPayload.businessDetails);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'businessDetails',
      JSON.stringify(businessDetailsPayload.businessDetails)
    );
  });

  it('should handle businessOperationFail', () => {
    const errorPayload = { error: 'Failed to fetch data' };
    const state = businessReducer({ ...initialState, isLoading: true }, businessOperationFail(errorPayload));

    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorPayload.error);
  });

  it('should handle clearBusinessData', () => {
    const loggedInState = {
      ...initialState,
      details: { id: 'biz-123', name: 'Pawtner Petshop' },
    };
    const state = businessReducer(loggedInState, clearBusinessData());
    expect(state.details).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('businessDetails');
  });
});
