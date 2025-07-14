import { describe, it, expect, vi, beforeEach } from 'vitest';
import prescriptionReducer, {
  operationStart,
  operationFail,
  fetchPrescriptionsSuccess,
  fetchPrescriptionByIdSuccess,
  createPrescriptionSuccess,
  deletePrescriptionSuccess,
  clearPrescriptions,
  fetchPrescriptionsByBooking,
  createNewPrescription,
  deleteExistingPrescription,
} from '../slices/prescriptionSlice'
import * as prescriptionApi from '../../api/prescriptionApi';

// Mock modul API
vi.mock('../../api/prescriptionApi');

const initialState = {
  items: [],
  pagination: {},
  currentItem: null,
  status: 'idle',
  error: null,
};

describe('prescriptionSlice reducers', () => {
  it('should return the initial state for unknown actions', () => {
    expect(prescriptionReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle operationStart', () => {
    const state = prescriptionReducer(initialState, operationStart());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle operationFail', () => {
    const error = 'Something went wrong';
    const state = prescriptionReducer(initialState, operationFail({ error }));
    expect(state.status).toBe('failed');
    expect(state.error).toBe(error);
  });

  it('should handle fetchPrescriptionsSuccess with data', () => {
    const prescriptionData = { id: 1, medication: 'Aspirin' };
    const state = prescriptionReducer(initialState, fetchPrescriptionsSuccess(prescriptionData));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual([prescriptionData]);
  });

  it('should handle fetchPrescriptionsSuccess with null data', () => {
    const state = prescriptionReducer(initialState, fetchPrescriptionsSuccess(null));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual([]);
  });

  it('should handle fetchPrescriptionByIdSuccess', () => {
    const prescription = { id: 1, medication: 'Paracetamol' };
    const state = prescriptionReducer(initialState, fetchPrescriptionByIdSuccess(prescription));
    expect(state.status).toBe('succeeded');
    expect(state.currentItem).toEqual(prescription);
  });

  it('should handle createPrescriptionSuccess', () => {
    const previousState = { ...initialState, items: [{ id: 1, medication: 'Old Med' }] };
    const newPrescription = { id: 2, medication: 'New Med' };
    const state = prescriptionReducer(previousState, createPrescriptionSuccess(newPrescription));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual([newPrescription]);
  });

  it('should handle deletePrescriptionSuccess', () => {
    const previousState = { ...initialState, items: [{ id: 1, medication: 'To be deleted' }] };
    const state = prescriptionReducer(previousState, deletePrescriptionSuccess());
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual([]);
  });

  it('should handle clearPrescriptions', () => {
    const previousState = {
      items: [{ id: 1 }],
      currentItem: { id: 1 },
      status: 'succeeded',
      error: 'An old error',
    };
    const state = prescriptionReducer(previousState, clearPrescriptions());
    expect(state.items).toEqual([]);
    expect(state.currentItem).toBeNull();
    expect(state.status).toBe('idle');
    expect(state.error).toBeNull();
  });
});

describe('prescriptionSlice thunks', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchPrescriptionsByBooking', () => {
    it('should dispatch success when API call is successful', async () => {
      const response = { data: { id: 1, medication: 'Ibuprofen' } };
      prescriptionApi.getPrescriptionsByBookingId.mockResolvedValue(response);

      await fetchPrescriptionsByBooking('booking-123')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(operationStart());
      expect(prescriptionApi.getPrescriptionsByBookingId).toHaveBeenCalledWith('booking-123');
      expect(dispatch).toHaveBeenCalledWith(fetchPrescriptionsSuccess(response.data));
    });

    it('should handle 404 error by dispatching success with null', async () => {
      const error = { response: { status: 404, data: { message: 'Not Found' } } };
      prescriptionApi.getPrescriptionsByBookingId.mockRejectedValue(error);

      await fetchPrescriptionsByBooking('booking-404')(dispatch);

      expect(dispatch).toHaveBeenCalledWith(operationStart());
      // Kasus khusus: 404 dianggap "sukses" dengan data null, bukan gagal
      expect(dispatch).toHaveBeenCalledWith(fetchPrescriptionsSuccess(null));
      expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: operationFail.type }));
    });

    it('should dispatch fail on other API errors', async () => {
      const errorMessage = 'Internal Server Error';
      const error = { response: { data: { message: errorMessage } } };
      prescriptionApi.getPrescriptionsByBookingId.mockRejectedValue(error);

      await expect(fetchPrescriptionsByBooking('booking-500')(dispatch)).rejects.toThrow(errorMessage);

      expect(dispatch).toHaveBeenCalledWith(operationStart());
      expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });

  describe('createNewPrescription', () => {
    it('should dispatch success and return data on successful creation', async () => {
      const payload = { bookingId: 'booking-1', medication: 'Amlodipine' };
      const response = { data: { id: 2, ...payload } };
      prescriptionApi.createPrescription.mockResolvedValue(response);

      const result = await createNewPrescription(payload)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(operationStart());
      expect(prescriptionApi.createPrescription).toHaveBeenCalledWith(payload);
      expect(dispatch).toHaveBeenCalledWith(createPrescriptionSuccess(response.data));
      expect(result).toEqual(response.data);
    });

    it('should dispatch fail on API error', async () => {
        const errorMessage = 'Failed to create';
        const error = { response: { data: { message: errorMessage } } };
        prescriptionApi.createPrescription.mockRejectedValue(error);

        await expect(createNewPrescription({})(dispatch)).rejects.toThrow(errorMessage);
        
        expect(dispatch).toHaveBeenCalledWith(operationStart());
        expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });

  describe('deleteExistingPrescription', () => {
    it('should dispatch success on successful deletion', async () => {
        const prescriptionId = 'pres-1';
        prescriptionApi.deletePrescription.mockResolvedValue({}); // Response tidak penting

        await deleteExistingPrescription(prescriptionId)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(operationStart());
        expect(prescriptionApi.deletePrescription).toHaveBeenCalledWith(prescriptionId);
        expect(dispatch).toHaveBeenCalledWith(deletePrescriptionSuccess());
    });

    it('should dispatch fail on API error', async () => {
        const errorMessage = 'Deletion failed';
        const error = { response: { data: { message: errorMessage } } };
        prescriptionApi.deletePrescription.mockRejectedValue(error);

        await expect(deleteExistingPrescription('pres-1')(dispatch)).rejects.toThrow(errorMessage);
        
        expect(dispatch).toHaveBeenCalledWith(operationStart());
        expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });
});