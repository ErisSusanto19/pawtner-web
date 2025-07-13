import { describe, it, expect } from 'vitest';
import bookingReducer, {
  bookingOperationStart,
  bookingOperationFail,
  fetchBookingsSuccess,
  fetchBookingByIdSuccess,
  updateBookingStatusSuccess,
  clearCurrentBooking,
} from '../slices/bookingSlice';

const initialState = {
  items: [],
  pagination: {
    size: 0,
    number: 0,
    totalElements: 0,
    totalPages: 0,
  },
  currentBooking: null,
  status: 'idle',
  error: null,
};

describe('bookingSlice reducers', () => {
  it('should return the initial state', () => {
    expect(bookingReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle bookingOperationStart', () => {
    const state = bookingReducer(initialState, bookingOperationStart());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle bookingOperationFail', () => {
    const errorPayload = { error: 'Failed to process booking' };
    const state = bookingReducer(initialState, bookingOperationFail(errorPayload));
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Failed to process booking');
  });

  it('should handle fetchBookingsSuccess', () => {
    const payload = {
      content: [{ id: 'booking1', status: 'CONFIRMED' }],
      page: { size: 10, number: 0, totalElements: 1, totalPages: 1 },
    };
    const state = bookingReducer(initialState, fetchBookingsSuccess(payload));
    expect(state.status).toBe('succeeded');
    expect(state.items).toEqual(payload.content);
    expect(state.pagination).toEqual(payload.page);
  });

  it('should handle fetchBookingByIdSuccess', () => {
    const booking = { id: 'booking1', status: 'CONFIRMED' };
    const state = bookingReducer(initialState, fetchBookingByIdSuccess(booking));
    expect(state.status).toBe('succeeded');
    expect(state.currentBooking).toEqual(booking);
  });

  it('should handle updateBookingStatusSuccess', () => {
    const initialBookings = [{ id: 'booking1', status: 'PENDING' }];
    const updatedBooking = { id: 'booking1', status: 'CONFIRMED' };
    const state = bookingReducer(
      { ...initialState, items: initialBookings, currentBooking: initialBookings[0] },
      updateBookingStatusSuccess(updatedBooking)
    );
    // Cek di daftar items
    expect(state.items[0].status).toBe('CONFIRMED');
    // Cek di currentBooking
    expect(state.currentBooking.status).toBe('CONFIRMED');
  });

  it('should handle clearCurrentBooking', () => {
    const state = bookingReducer(
      { ...initialState, currentBooking: { id: 'booking1' } },
      clearCurrentBooking()
    );
    expect(state.currentBooking).toBeNull();
  });
});
