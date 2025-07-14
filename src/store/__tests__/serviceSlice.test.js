
import { describe, it, expect, vi, beforeEach } from 'vitest';
import serviceReducer, {
  serviceOperationStart,
  serviceOperationFail,
  fetchServicesSuccess,
  fetchServiceByIdSuccess,
  createServiceSuccess,
  updateServiceSuccess,
  deleteServiceSuccess,
  setCurrentService,
  fetchServices,
  fetchServiceById,
  createNewService,
  updateExistingService,
  deleteExistingService,
} from '../slices/serviceSlice';
import * as serviceApi from '../../api/serviceApi';

vi.mock('../../api/serviceApi');

const initialState = {
  items: [],
  pagination: {
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  },
  currentItem: null,
  status: 'idle',
  error: null,
};

describe('serviceSlice reducers', () => {
  it('should return the initial state', () => {
    expect(serviceReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle serviceOperationStart', () => {
    const state = serviceReducer(initialState, serviceOperationStart());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle serviceOperationFail', () => {
    const error = 'Operation failed';
    const state = serviceReducer(initialState, serviceOperationFail({ error }));
    expect(state.status).toBe('failed');
    expect(state.error).toBe(error);
  });

  it('should handle fetchServicesSuccess and filter inactive services', () => {
    const payload = {
      content: [
        { id: 1, name: 'Service 1', isActive: true },
        { id: 2, name: 'Service 2', isActive: false },
      ],
      page: { totalPages: 1 },
    };
    const state = serviceReducer(initialState, fetchServicesSuccess(payload));
    expect(state.items.length).toBe(1);
    expect(state.items[0].name).toBe('Service 1');
    expect(state.pagination).toEqual(payload.page);
  });

  it('should handle fetchServiceByIdSuccess', () => {
    const service = { id: 1, name: 'Service 1' };
    const state = serviceReducer(initialState, fetchServiceByIdSuccess(service));
    expect(state.currentItem).toEqual(service);
  });

  it('should handle createServiceSuccess', () => {
    const newService = { service: { id: 2, name: 'Service 2' } };
    const state = serviceReducer(initialState, createServiceSuccess(newService));
    expect(state.items.length).toBe(1);
    expect(state.items[0]).toEqual(newService.service);
  });

  it('should handle updateServiceSuccess', () => {
    const previousState = { ...initialState, items: [{ id: 1, name: 'Old Name' }] };
    const updatedService = { service: { id: 1, name: 'New Name' } };
    const state = serviceReducer(previousState, updateServiceSuccess(updatedService));
    expect(state.items[0].name).toBe('New Name');
  });

  it('should handle deleteServiceSuccess', () => {
    const previousState = { ...initialState, items: [{ id: 1, name: 'To Delete' }] };
    const state = serviceReducer(previousState, deleteServiceSuccess({ serviceId: 1 }));
    expect(state.items.length).toBe(0);
  });

  it('should handle setCurrentService', () => {
    const service = { id: 1, name: 'Current Service' };
    const state = serviceReducer(initialState, setCurrentService(service));
    expect(state.currentItem).toEqual(service);
  });
});

describe('serviceSlice thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn(() => ({ business: { details: { businessId: 'biz-123' } } }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchServices should dispatch success', async () => {
    const response = { data: { content: [], page: {} } };
    serviceApi.getMyServices.mockResolvedValue(response);
    await fetchServices()(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(serviceOperationStart());
    expect(dispatch).toHaveBeenCalledWith(fetchServicesSuccess(response.data));
  });

  it('fetchServiceById should dispatch success', async () => {
    const response = { data: { id: 1 } };
    serviceApi.getServiceById.mockResolvedValue(response);
    await fetchServiceById(1)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(serviceOperationStart());
    expect(dispatch).toHaveBeenCalledWith(fetchServiceByIdSuccess(response.data));
  });

  it('createNewService should dispatch success', async () => {
    const serviceData = { name: 'New Service' };
    const response = { data: { id: 1, ...serviceData } };
    serviceApi.createService.mockResolvedValue(response);
    await createNewService(serviceData)(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(serviceOperationStart());
    expect(dispatch).toHaveBeenCalledWith(createServiceSuccess({ service: response.data }));
  });

  it('updateExistingService should dispatch success', async () => {
    const serviceData = { name: 'Updated Service' };
    const response = { data: { id: 1, ...serviceData } };
    serviceApi.updateService.mockResolvedValue(response);
    await updateExistingService({ serviceId: 1, serviceData })(dispatch, getState);
    expect(dispatch).toHaveBeenCalledWith(serviceOperationStart());
    expect(dispatch).toHaveBeenCalledWith(updateServiceSuccess({ service: response.data }));
  });

  it('deleteExistingService should dispatch success', async () => {
    const response = { data: {} };
    serviceApi.deleteService.mockResolvedValue(response);
    await deleteExistingService(1)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(serviceOperationStart());
    expect(dispatch).toHaveBeenCalledWith(deleteServiceSuccess({ serviceId: 1 }));
  });

  it('fetchServices should dispatch fail on error', async () => {
    const error = { response: { data: { message: 'Error' } } };
    serviceApi.getMyServices.mockRejectedValue(error);
    await expect(fetchServices()(dispatch, getState)).rejects.toThrow();
    expect(dispatch).toHaveBeenCalledWith(serviceOperationFail({ error: 'Error' }));
  });
});
