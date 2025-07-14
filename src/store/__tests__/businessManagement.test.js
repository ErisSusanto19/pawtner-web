import { describe, it, expect, vi, beforeEach } from 'vitest';
import businessManagementReducer, {
  operationStart,
  operationFail,
  fetchAllBusinessesSuccess,
  fetchBusinessByIdSuccess,
  updateBusinessSuccess,
  clearSelectedBusiness,
  fetchAllBusinesses,
  fetchBusinessById,
  approveOrRejectBusiness,
} from '../slices/businessManagementSlice';
import * as businessManagementApi from '../../api/businessManagementApi';

// Mock modul API
vi.mock('../../api/businessManagementApi');

const initialState = {
  items: [],
  selectedBusiness: null,
  isLoading: false,
  error: null,
  status: 'idle',
};

describe('businessManagementSlice reducers', () => {
  it('should return the initial state', () => {
    expect(businessManagementReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle operationStart', () => {
    const state = businessManagementReducer(initialState, operationStart());
    expect(state.isLoading).toBe(true);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle operationFail', () => {
    const error = 'Operation failed';
    const state = businessManagementReducer(initialState, operationFail({ error }));
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('failed');
    expect(state.error).toBe(error);
  });

  describe('fetchAllBusinessesSuccess', () => {
    it('should set items with a valid data array', () => {
      const payload = { data: [{ businessId: 1, name: 'Biz One' }] };
      const state = businessManagementReducer(initialState, fetchAllBusinessesSuccess(payload));
      expect(state.items).toEqual(payload.data);
      expect(state.isLoading).toBe(false);
      expect(state.status).toBe('succeeded');
    });

    it('should set items to an empty array if payload data is not an array', () => {
      const invalidPayload = { data: { message: 'not an array' } };
      const state = businessManagementReducer(initialState, fetchAllBusinessesSuccess(invalidPayload));
      expect(state.items).toEqual([]);
    });

    it('should set items to an empty array if payload is null', () => {
      const state = businessManagementReducer(initialState, fetchAllBusinessesSuccess(null));
      expect(state.items).toEqual([]);
    });
  });

  it('should handle fetchBusinessByIdSuccess', () => {
    const business = { businessId: 1, name: 'Selected Biz' };
    const state = businessManagementReducer(initialState, fetchBusinessByIdSuccess({ data: business }));
    expect(state.selectedBusiness).toEqual(business);
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('succeeded');
  });

  describe('updateBusinessSuccess', () => {
    const previousState = {
      ...initialState,
      items: [
        { businessId: 'biz-1', name: 'Old Biz Name', status: 'PENDING' },
        { businessId: 'biz-2', name: 'Another Biz', status: 'APPROVED' },
      ],
      selectedBusiness: { businessId: 'biz-1', name: 'Old Biz Name', status: 'PENDING', owner: 'John' },
    };

    it('should merge updated properties into the correct business in items and selectedBusiness', () => {
      const updatedData = { businessId: 'biz-1', status: 'APPROVED', reason: 'Looks good' };
      const state = businessManagementReducer(previousState, updateBusinessSuccess(updatedData));

      expect(state.items[0].name).toBe('Old Biz Name'); // Properti lama tetap ada
      expect(state.items[0].status).toBe('APPROVED'); // Properti baru diperbarui

      // Cek selectedBusiness
      expect(state.selectedBusiness.name).toBe('Old Biz Name');
      expect(state.selectedBusiness.status).toBe('APPROVED');
      expect(state.selectedBusiness.owner).toBe('John'); // Properti lama lainnya tetap ada
      
      expect(state.isLoading).toBe(false);
      expect(state.status).toBe('succeeded');
    });

    it('should not update selectedBusiness if its ID does not match', () => {
        const stateWithDifferentSelection = { ...previousState, selectedBusiness: { businessId: 'biz-99' } };
        const updatedData = { businessId: 'biz-2', status: 'REJECTED' };
        const state = businessManagementReducer(stateWithDifferentSelection, updateBusinessSuccess(updatedData));

        expect(state.items[1].status).toBe('REJECTED'); // Item dalam list diperbarui
        expect(state.selectedBusiness.businessId).toBe('biz-99'); // selectedBusiness tidak berubah
    });
  });
});

describe('businessManagementSlice thunks', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllBusinesses', () => {
    it('should dispatch success on successful API call', async () => {
        const response = { data: [{ businessId: 1 }] };
        businessManagementApi.getAllBusinesses.mockResolvedValue(response);
        
        await fetchAllBusinesses()(dispatch);

        expect(dispatch).toHaveBeenCalledWith(operationStart());
        expect(businessManagementApi.getAllBusinesses).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalledWith(fetchAllBusinessesSuccess(response));
    });

    it('should dispatch fail on API error', async () => {
        const errorMessage = 'Failed to fetch';
        const error = { message: errorMessage };
        businessManagementApi.getAllBusinesses.mockRejectedValue(error);

        await expect(fetchAllBusinesses()(dispatch)).rejects.toThrow(errorMessage);
        expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });

  describe('fetchBusinessById', () => {
    it('should dispatch success on successful API call', async () => {
        const businessId = 'biz-1';
        const response = { data: { businessId, name: 'Biz One' } };
        businessManagementApi.getBusinessById.mockResolvedValue(response);

        await fetchBusinessById(businessId)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(operationStart());
        expect(businessManagementApi.getBusinessById).toHaveBeenCalledWith(businessId);
        expect(dispatch).toHaveBeenCalledWith(fetchBusinessByIdSuccess(response));
    });

    it('should dispatch fail on API error', async () => {
        const errorMessage = 'Not found';
        const error = { response: { data: { message: errorMessage } } };
        businessManagementApi.getBusinessById.mockRejectedValue(error);
        
        await expect(fetchBusinessById('biz-404')(dispatch)).rejects.toThrow(errorMessage);
        expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });

  describe('approveOrRejectBusiness', () => {
    it('should call approveBusiness with correct body and dispatch success on approval', async () => {
        const businessId = 'biz-1';
        const isApproved = true;
        const reason = 'All documents are valid';
        const response = { data: { businessId, status: 'APPROVED' } };
        
        businessManagementApi.approveBusiness.mockResolvedValue(response);

        await approveOrRejectBusiness(businessId, isApproved, reason)(dispatch);

        const expectedBody = { approve: true, reason };

        expect(dispatch).toHaveBeenCalledWith(operationStart());
        expect(businessManagementApi.approveBusiness).toHaveBeenCalledWith(businessId, expectedBody);
        expect(dispatch).toHaveBeenCalledWith(updateBusinessSuccess(response.data));
    });

    it('should dispatch fail on API error', async () => {
        const errorMessage = 'Update failed';
        const error = { message: errorMessage };
        businessManagementApi.approveBusiness.mockRejectedValue(error);

        await expect(approveOrRejectBusiness('biz-1', false, 'N/A')(dispatch)).rejects.toThrow(errorMessage);
        expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });
});