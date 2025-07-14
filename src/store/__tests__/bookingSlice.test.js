import { describe, it, expect, vi, beforeEach } from 'vitest';
import businessReducer, {
  businessOperationStart,
  businessOperationSuccess,
  businessOperationFail,
  clearBusinessData,
  createBusiness,
  fetchMyBusiness,
  updateBusinessDetails,
} from '../slices/businessSlice';
import * as businessApi from '../../api/businessApi';
import * as authSlice from '../slices/authSlice';

vi.mock('../../api/businessApi');
vi.mock('../slices/authSlice', () => ({
  updateUserBusinessStatus: vi.fn(),
}));

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
    vi.spyOn(Storage.prototype, 'getItem').mockClear();
  });

  it('should return the initial state on first run', () => {
    Storage.prototype.getItem.mockReturnValueOnce(null);
    expect(businessReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle businessOperationStart', () => {
    const state = businessReducer(initialState, businessOperationStart());
    expect(state.isLoading).toBe(true);
    expect(state.status).toBe('loading');
  });

  it('should handle businessOperationSuccess', () => {
    const payload = { businessDetails: { id: 'biz-123', name: 'Test Shop' } };
    const state = businessReducer(initialState, businessOperationSuccess(payload));

    expect(state.status).toBe('succeeded');
    expect(state.details).toEqual(payload.businessDetails);
    expect(localStorage.setItem).toHaveBeenCalledWith('businessDetails', JSON.stringify(payload.businessDetails));
  });

  it('should handle businessOperationFail', () => {
    const errorPayload = { error: 'Failed to fetch' };
    const state = businessReducer(initialState, businessOperationFail(errorPayload));
    expect(state.status).toBe('failed');
    expect(state.error).toBe(errorPayload.error);
  });

  it('should handle clearBusinessData', () => {
    const loggedInState = { ...initialState, details: { id: 'biz-123' } };
    const state = businessReducer(loggedInState, clearBusinessData());
    expect(state.details).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('businessDetails');
  });
});


describe('businessSlice thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn(() => ({
    business: { details: { businessId: 'biz-123', name: 'Old Name' } },
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, 'setItem').mockClear();
    vi.spyOn(Storage.prototype, 'removeItem').mockClear();
  });

  describe('createBusiness', () => {
    const formData = { name: 'New Cafe', businessImageUrl: 'file1.jpg', certificateImageUrl: 'cert1.pdf' };

    it('should dispatch success and update auth status on successful creation', async () => {
      const response = { data: { id: 'new-biz-id', name: 'New Cafe' } };
      businessApi.registerBusiness.mockResolvedValue(response);

      await createBusiness(formData)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(businessOperationStart());
      expect(businessApi.registerBusiness).toHaveBeenCalledWith(expect.any(FormData));
      expect(localStorage.setItem).toHaveBeenCalledWith('businessDetails', JSON.stringify(response.data));
      expect(dispatch).toHaveBeenCalledWith(businessOperationSuccess({ businessDetails: response.data }));
      expect(authSlice.updateUserBusinessStatus).toHaveBeenCalledWith(true);
    });

    it('should dispatch fail with a custom message for duplicate email error', async () => {
        const errorMessage = 'A similar record exists for business email';
        businessApi.registerBusiness.mockRejectedValue({ response: { data: { message: errorMessage } } });
        const expectedCustomError = "Business email is already in use. Please use a different one.";

        await expect(createBusiness(formData)(dispatch)).rejects.toThrow(expectedCustomError);
        
        expect(dispatch).toHaveBeenCalledWith(businessOperationFail({ error: expectedCustomError }));
        expect(authSlice.updateUserBusinessStatus).not.toHaveBeenCalled();
    });
  });

  describe('fetchMyBusiness', () => {
    it('should fetch and set business details if a business is found', async () => {
      const myBusiness = { id: 'my-biz-1', name: 'My Pet Store' };
      const response = { data: [myBusiness] };
      businessApi.getMyBusiness.mockResolvedValue(response);

      await fetchMyBusiness()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(businessOperationStart());
      expect(dispatch).toHaveBeenCalledWith(businessOperationSuccess({ businessDetails: myBusiness }));
      expect(localStorage.setItem).toHaveBeenCalledWith('businessDetails', JSON.stringify(myBusiness));
      expect(authSlice.updateUserBusinessStatus).toHaveBeenCalledWith(true);
    });

    it('should clear business data if no business is found', async () => {
        const response = { data: [] };
        businessApi.getMyBusiness.mockResolvedValue(response);
  
        await fetchMyBusiness()(dispatch);
  
        expect(dispatch).toHaveBeenCalledWith(businessOperationStart());
        expect(localStorage.removeItem).toHaveBeenCalledWith('businessDetails');
        expect(dispatch).toHaveBeenCalledWith(clearBusinessData());
        expect(authSlice.updateUserBusinessStatus).not.toHaveBeenCalled();
      });
  });

  describe('updateBusinessDetails', () => {
    const formData = { name: 'Updated Cafe Name' };
    
    it('should dispatch success with merged data on successful update', async () => {
        const apiResponse = { data: { name: 'Updated Cafe Name', location: 'New Location' } };
        businessApi.updateBusiness.mockResolvedValue(apiResponse);

        await updateBusinessDetails(formData)(dispatch, getState);

        const expectedMergedDetails = {
            businessId: 'biz-123',
            name: 'Updated Cafe Name',
            location: 'New Location'
        };

        expect(dispatch).toHaveBeenCalledWith(businessOperationStart());
        expect(businessApi.updateBusiness).toHaveBeenCalledWith('biz-123', expect.any(FormData));
        expect(dispatch).toHaveBeenCalledWith(businessOperationSuccess({ businessDetails: expect.objectContaining(expectedMergedDetails) }));
        expect(localStorage.setItem).toHaveBeenCalledWith('businessDetails', expect.stringContaining('Updated Cafe Name'));
    });

    it('should throw and dispatch fail if businessId is not found in state', async () => {
        const getStateWithoutId = vi.fn(() => ({ business: { details: null } }));
        const errorMessage = "Business ID not found. Cannot update.";
        
        await expect(updateBusinessDetails(formData)(dispatch, getStateWithoutId)).rejects.toThrow(errorMessage);
        
        expect(dispatch).toHaveBeenCalledWith(businessOperationFail({ error: errorMessage }));
        expect(businessApi.updateBusiness).not.toHaveBeenCalled();
    });
  });
});