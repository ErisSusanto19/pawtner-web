import { describe, it, expect } from 'vitest';
import productReducer, {
  fetchProductsSuccess,
  createProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
  setCurrentProduct,
  productOperationStart,
  productOperationFail,
} from '../slices/productSlice';

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

describe('productSlice reducers', () => {
  it('should return the initial state', () => {
    expect(productReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle productOperationStart', () => {
    const state = productReducer(initialState, productOperationStart());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle productOperationFail', () => {
    const errorPayload = { error: 'API Error' };
    const state = productReducer(initialState, productOperationFail(errorPayload));
    expect(state.status).toBe('failed');
    expect(state.error).toBe('API Error');
  });

  it('should handle fetchProductsSuccess', () => {
    const payload = {
      content: [
        { id: 1, name: 'Product A', isActive: true },
        { id: 2, name: 'Product B', isActive: false }, // Should be filtered out
        { id: 3, name: 'Product C', isActive: true },
      ],
      page: { number: 0, size: 10, totalElements: 3 },
    };
    const state = productReducer(initialState, fetchProductsSuccess(payload));
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(2); // Only active items
    expect(state.items[0].name).toBe('Product A');
    expect(state.pagination.totalElements).toBe(2);
    expect(state.pagination.totalPages).toBe(1);
  });

  it('should handle createProductSuccess', () => {
    const newProduct = { id: 2, name: 'Product B' };
    const state = productReducer(
      { ...initialState, items: [{ id: 1, name: 'Product A' }] },
      createProductSuccess({ product: newProduct })
    );
    expect(state.items).toHaveLength(2);
    expect(state.items[0]).toEqual(newProduct); // unshift adds to the beginning
  });

  it('should handle updateProductSuccess', () => {
    const updatedProduct = { id: 1, name: 'Updated Product A' };
    const state = productReducer(
      { ...initialState, items: [{ id: 1, name: 'Product A' }] },
      updateProductSuccess({ product: updatedProduct })
    );
    expect(state.items[0].name).toBe('Updated Product A');
  });

  it('should handle deleteProductSuccess', () => {
    const state = productReducer(
      { ...initialState, items: [{ id: 1, name: 'Product A' }] },
      deleteProductSuccess({ productId: 1 })
    );
    expect(state.items).toHaveLength(0);
  });

  it('should handle setCurrentProduct', () => {
    const product = { id: 1, name: 'Product A' };
    const state = productReducer(initialState, setCurrentProduct(product));
    expect(state.currentItem).toEqual(product);
  });
});
