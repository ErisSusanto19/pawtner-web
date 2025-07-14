import { describe, it, expect, vi, beforeEach } from 'vitest';
import productReducer, {
  productOperationStart,
  productOperationFail,
  fetchProductsSuccess,
  fetchProductByIdSuccess,
  createProductSuccess,
  updateProductSuccess,
  deleteProductSuccess,
  setCurrentProduct,
  fetchProducts,
  fetchProductById,
  createNewProduct,
  updateExistingProduct,
  deleteExistingProduct,
} from '../slices/productSlice';
import * as productApi from '../../api/productApi';

vi.mock('../../api/productApi');

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

  it('should handle fetchProductsSuccess and filter inactive items', () => {
    const payload = {
      content: [
        { id: 1, name: 'Product A', isActive: true },
        { id: 2, name: 'Product B', isActive: false },
        { id: 3, name: 'Product C', isActive: true },
      ],
      page: { number: 0, size: 10, totalElements: 3 },
    };
    const state = productReducer(initialState, fetchProductsSuccess(payload));
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(2);
    expect(state.items[0].name).toBe('Product A');
    expect(state.pagination.totalElements).toBe(2);
    expect(state.pagination.totalPages).toBe(1);
  });

  it('should handle fetchProductByIdSuccess', () => {
    const product = { id: 1, name: 'Product A' };
    const state = productReducer(initialState, fetchProductByIdSuccess(product));
    expect(state.status).toBe('succeeded');
    expect(state.currentItem).toEqual(product);
  });

  it('should handle createProductSuccess', () => {
    const newProduct = { id: 2, name: 'Product B' };
    const state = productReducer(
      { ...initialState, items: [{ id: 1, name: 'Product A' }] },
      createProductSuccess({ product: newProduct })
    );
    expect(state.items).toHaveLength(2);
    expect(state.items[0]).toEqual(newProduct);
  });

  describe('updateProductSuccess', () => {
    const updatedProductData = { id: 1, name: 'Updated Product A' };
    
    it('should update a product in the items list', () => {
      const prevState = { ...initialState, items: [{ id: 1, name: 'Product A' }] };
      const state = productReducer(prevState, updateProductSuccess({ product: updatedProductData }));
      expect(state.items[0].name).toBe('Updated Product A');
    });

    it('should also update currentItem if its ID matches', () => {
      const prevState = { 
        ...initialState, 
        items: [{ id: 1, name: 'Product A' }],
        currentItem: { id: 1, name: 'Product A' }
      };
      const state = productReducer(prevState, updateProductSuccess({ product: updatedProductData }));
      expect(state.items[0]).toEqual(updatedProductData);
      expect(state.currentItem).toEqual(updatedProductData);
    });
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


describe('productSlice thunks', () => {
  const dispatch = vi.fn();
  const getState = vi.fn(() => ({
    business: { details: { businessId: 'biz-123' } },
  }));


  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchProducts', () => {
    it('should dispatch success action on successful API call', async () => {
      const response = { data: { content: [], page: {} } };
      productApi.getMyProducts.mockResolvedValue(response);

      await fetchProducts()(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(productOperationStart());
      expect(productApi.getMyProducts).toHaveBeenCalledWith('biz-123', undefined);
      expect(dispatch).toHaveBeenCalledWith(fetchProductsSuccess(response.data));
    });

    it('should dispatch fail action on API error', async () => {
      const errorMessage = 'Network Error';
      productApi.getMyProducts.mockRejectedValue({ message: errorMessage });

      await expect(fetchProducts()(dispatch, getState)).rejects.toThrow(errorMessage);

      expect(dispatch).toHaveBeenCalledWith(productOperationStart());
      expect(dispatch).toHaveBeenCalledWith(productOperationFail({ error: errorMessage }));
    });
  });

  describe('createNewProduct', () => {
    const productData = { name: 'New Gadget', price: 100 };

    it('should dispatch success action on successful creation', async () => {
      const response = { data: { id: 1, ...productData } };
      productApi.createProduct.mockResolvedValue(response);

      await createNewProduct(productData)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(productOperationStart());
      expect(productApi.createProduct).toHaveBeenCalledWith(expect.any(FormData));
      expect(dispatch).toHaveBeenCalledWith(createProductSuccess({ product: response.data }));
    });

    it('should reject and dispatch fail if businessId is not found', async () => {
      const getStateWithoutBizId = vi.fn(() => ({ business: { details: {} } }));
      const errorMessage = "Business ID not found. Please reload.";
      
      await expect(createNewProduct(productData)(dispatch, getStateWithoutBizId)).rejects.toThrow(errorMessage);

      expect(dispatch).toHaveBeenCalledWith(productOperationStart());
      expect(productApi.createProduct).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(productOperationFail({ error: errorMessage }));
    });
  });

  describe('updateExistingProduct', () => {
    const updatePayload = { productId: 'prod-1', productData: { name: 'Updated Name' } };

    it('should dispatch success on successful update', async () => {
      const response = { data: { id: 'prod-1', name: 'Updated Name' } };
      productApi.updateProduct.mockResolvedValue(response);

      await updateExistingProduct(updatePayload)(dispatch, getState);

      expect(dispatch).toHaveBeenCalledWith(productOperationStart());
      expect(productApi.updateProduct).toHaveBeenCalledWith('prod-1', expect.any(FormData));
      expect(dispatch).toHaveBeenCalledWith(updateProductSuccess({ product: response.data }));
    });
  });

  describe('deleteExistingProduct', () => {
    it('should dispatch success on successful deletion', async () => {
        const productId = 'prod-to-delete';
        productApi.deleteProduct.mockResolvedValue({});

        await deleteExistingProduct(productId)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(productOperationStart());
        expect(productApi.deleteProduct).toHaveBeenCalledWith(productId);
        expect(dispatch).toHaveBeenCalledWith(deleteProductSuccess({ productId }));
    });
  });
});