
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import orderReducer, {
  orderOperationStart,
  orderOperationFail,
  fetchOrdersSuccess,
  fetchOrderByIdSuccess,
  updateOrderStatusSuccess,
  clearCurrentOrder,
  fetchBusinessOrders,
  fetchOrderById,
  changeOrderStatus,
} from '../slices/orderSlice';
import * as orderApi from '../../api/orderApi';

vi.mock('../../api/orderApi');

const initialState = {
  items: [],
  pagination: {
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  },
  currentOrder: null,
  status: 'idle',
  error: null,
};

describe('orderSlice reducers', () => {
  it('should return the initial state', () => {
    expect(orderReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle orderOperationStart', () => {
    const state = orderReducer(initialState, orderOperationStart());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle orderOperationFail', () => {
    const error = 'Failed to fetch';
    const state = orderReducer(initialState, orderOperationFail({ error }));
    expect(state.status).toBe('failed');
    expect(state.error).toBe(error);
  });

  it('should handle fetchOrdersSuccess', () => {
    const payload = {
      content: [{ id: 1, total: 100 }],
      page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
    };
    const state = orderReducer(initialState, fetchOrdersSuccess(payload));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(payload.content);
    expect(state.pagination).toEqual(payload.page);
  });

  it('should handle fetchOrderByIdSuccess', () => {
    const order = { id: 1, total: 100 };
    const state = orderReducer(initialState, fetchOrderByIdSuccess(order));
    expect(state.status).toBe('succeeded');
    expect(state.currentOrder).toEqual(order);
  });

  it('should handle updateOrderStatusSuccess', () => {
    const previousState = {
      ...initialState,
      items: [{ id: 1, status: 'PENDING' }],
      currentOrder: { id: 1, status: 'PENDING' },
    };
    const updatedOrder = { id: 1, status: 'COMPLETED' };
    const state = orderReducer(previousState, updateOrderStatusSuccess(updatedOrder));
    expect(state.status).toBe('succeeded');
    expect(state.items[0]).toEqual(updatedOrder);
    expect(state.currentOrder).toEqual(updatedOrder);
  });

  it('should handle clearCurrentOrder', () => {
    const previousState = { ...initialState, currentOrder: { id: 1 } };
    const state = orderReducer(previousState, clearCurrentOrder());
    expect(state.currentOrder).toBeNull();
  });
});

describe('orderSlice thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn(() => ({
    business: { details: { businessId: 'biz-123' } },
  }));

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchBusinessOrders', () => {
    it('should dispatch fetchOrdersSuccess on successful fetch', async () => {
      const response = { data: { content: [], page: {} } };
      orderApi.getBusinessOrders.mockResolvedValue(response);
      await fetchBusinessOrders({})(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith(orderOperationStart());
      expect(orderApi.getBusinessOrders).toHaveBeenCalledWith('biz-123', {});
      expect(dispatch).toHaveBeenCalledWith(fetchOrdersSuccess(response.data));
    });

    it('should dispatch orderOperationFail on fetch error', async () => {
      const error = new Error('Network Error');
      error.response = { data: { message: 'API Error' } };
      orderApi.getBusinessOrders.mockRejectedValue(error);
      await expect(fetchBusinessOrders({})(dispatch, getState)).rejects.toThrow('API Error');
      expect(dispatch).toHaveBeenCalledWith(orderOperationStart());
      expect(dispatch).toHaveBeenCalledWith(orderOperationFail({ error: 'API Error' }));
    });
  });

  describe('fetchOrderById', () => {
    it('should dispatch fetchOrderByIdSuccess on successful fetch', async () => {
      const order = { id: 1 };
      const response = { data: order };
      orderApi.getOrderById.mockResolvedValue(response);
      await fetchOrderById(1)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(orderOperationStart());
      expect(orderApi.getOrderById).toHaveBeenCalledWith(1);
      expect(dispatch).toHaveBeenCalledWith(fetchOrderByIdSuccess(order));
    });

    it('should dispatch orderOperationFail on fetch error', async () => {
        const error = new Error('Not Found');
        error.response = { data: { message: 'Order not found' } };
        orderApi.getOrderById.mockRejectedValue(error);
        await expect(fetchOrderById(1)(dispatch)).rejects.toThrow('Order not found');
        expect(dispatch).toHaveBeenCalledWith(orderOperationStart());
        expect(dispatch).toHaveBeenCalledWith(orderOperationFail({ error: 'Order not found' }));
    });
  });

  describe('changeOrderStatus', () => {
    it('should dispatch updateOrderStatusSuccess on successful update', async () => {
        const payload = { status: 'COMPLETED' };
        const response = { data: { id: 1, status: 'COMPLETED' } };
        orderApi.updateOrderStatus.mockResolvedValue(response);
        await changeOrderStatus({ orderId: 1, payload })(dispatch);
        expect(dispatch).toHaveBeenCalledWith(orderOperationStart());
        expect(orderApi.updateOrderStatus).toHaveBeenCalledWith(1, payload);
        expect(dispatch).toHaveBeenCalledWith(updateOrderStatusSuccess(response.data));
    });

    it('should dispatch orderOperationFail on update error', async () => {
        const payload = { status: 'COMPLETED' };
        const error = new Error('Update Failed');
        error.response = { data: { message: 'Update failed' } };
        orderApi.updateOrderStatus.mockRejectedValue(error);
        await expect(changeOrderStatus({ orderId: 1, payload })(dispatch)).rejects.toThrow('Update failed');
        expect(dispatch).toHaveBeenCalledWith(orderOperationStart());
        expect(dispatch).toHaveBeenCalledWith(orderOperationFail({ error: 'Update failed' }));
    });
  });
});
