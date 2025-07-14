import { describe, it, expect, vi, beforeEach } from 'vitest';
import userManagementReducer, {
  operationStart,
  operationFail,
  fetchAllUsersSuccess,
  fetchUserByIdSuccess,
  updateUserSuccess,
  clearSelectedUser,
  fetchAllUsers,
  fetchUserById,
  toggleUserStatusAction,
} from '../slices/userManagementSlice';
import * as userManagementApi from '../../api/userManagementApi';

// Mock modul API
vi.mock('../../api/userManagementApi');

const initialState = {
  items: [],
  selectedUser: null,
  pagination: {
    currentPage: 0,
    totalPages: 1,
    totalItems: 0,
    size: 10,
  },
  isLoading: false,
  error: null,
  status: 'idle',
};

describe('userManagementSlice reducers', () => {
  it('should return the initial state', () => {
    expect(userManagementReducer(undefined, {})).toEqual(initialState);
  });

  it('should handle operationStart', () => {
    const state = userManagementReducer(initialState, operationStart());
    expect(state.isLoading).toBe(true);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('should handle operationFail', () => {
    const error = 'Failed to perform operation';
    const state = userManagementReducer(initialState, operationFail({ error }));
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('failed');
    expect(state.error).toBe(error);
  });

  it('should handle fetchAllUsersSuccess and filter out ADMIN roles', () => {
    const payload = {
      data: [
        { id: 1, name: 'User One', role: 'USER' },
        { id: 2, name: 'Admin User', role: 'ADMIN' },
        { id: 3, name: 'User Three', role: 'MEMBER' },
      ],
    };
    const state = userManagementReducer(initialState, fetchAllUsersSuccess(payload));
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('succeeded');
    expect(state.items.length).toBe(2);
    expect(state.items.find(user => user.role === 'ADMIN')).toBeUndefined();
    expect(state.pagination.totalItems).toBe(payload.data.length); // pagination reflects total before filter
  });

  it('should handle fetchUserByIdSuccess', () => {
    const user = { id: 1, name: 'Selected User' };
    const payload = { data: user };
    const state = userManagementReducer(initialState, fetchUserByIdSuccess(payload));
    expect(state.selectedUser).toEqual(user);
    expect(state.isLoading).toBe(false);
    expect(state.status).toBe('succeeded');
  });

  describe('updateUserSuccess', () => {
    const previousState = {
      ...initialState,
      items: [
        { id: 1, name: 'Old Name', status: 'ACTIVE' },
        { id: 2, name: 'Another User', status: 'ACTIVE' },
      ],
      selectedUser: { id: 1, name: 'Old Name', status: 'ACTIVE' },
    };

    it('should update user in items list and selectedUser if IDs match', () => {
      const updatedUser = { id: 1, name: 'New Name', status: 'INACTIVE' };
      const state = userManagementReducer(previousState, updateUserSuccess(updatedUser));

      expect(state.items[0]).toEqual(updatedUser); // Check item in list
      expect(state.selectedUser).toEqual(updatedUser); // Check selectedUser
      expect(state.items[1].name).toBe('Another User'); // Ensure other users are untouched
      expect(state.isLoading).toBe(false);
      expect(state.status).toBe('succeeded');
    });

    it('should only update user in items list if selectedUser is different', () => {
        const stateWithDifferentSelectedUser = {
            ...previousState,
            selectedUser: {id: 99, name: 'Different User'}
        }
      const updatedUser = { id: 1, name: 'New Name', status: 'INACTIVE' };
      const state = userManagementReducer(stateWithDifferentSelectedUser, updateUserSuccess(updatedUser));

      expect(state.items[0]).toEqual(updatedUser);
      expect(state.selectedUser.id).toBe(99); // selectedUser should not be changed
    });
  });

  it('should handle clearSelectedUser', () => {
    const previousState = { ...initialState, selectedUser: { id: 1, name: 'A User' } };
    const state = userManagementReducer(previousState, clearSelectedUser());
    expect(state.selectedUser).toBeNull();
  });
});

describe('userManagementSlice thunks', () => {
  const dispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchAllUsers', () => {
    it('should dispatch success on successful API call', async () => {
      const response = { data: [{ id: 1, name: 'User 1' }] };
      userManagementApi.getAllUsers.mockResolvedValue(response);

      await fetchAllUsers()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(operationStart());
      expect(userManagementApi.getAllUsers).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(fetchAllUsersSuccess(response));
    });

    it('should dispatch fail on API error', async () => {
      const errorMessage = 'Error fetching users';
      const error = { response: { data: { message: errorMessage } } };
      userManagementApi.getAllUsers.mockRejectedValue(error);

      await expect(fetchAllUsers()(dispatch)).rejects.toThrow(errorMessage);

      expect(dispatch).toHaveBeenCalledWith(operationStart());
      expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });

  describe('fetchUserById', () => {
    it('should dispatch success on successful API call', async () => {
        const userId = 'user-123';
        const response = { data: { id: userId, name: 'Specific User' } };
        userManagementApi.getUserById.mockResolvedValue(response);

        await fetchUserById(userId)(dispatch);

        expect(dispatch).toHaveBeenCalledWith(operationStart());
        expect(userManagementApi.getUserById).toHaveBeenCalledWith(userId);
        expect(dispatch).toHaveBeenCalledWith(fetchUserByIdSuccess(response));
    });

    it('should dispatch fail on API error', async () => {
        const errorMessage = 'User not found';
        const error = { message: errorMessage };
        userManagementApi.getUserById.mockRejectedValue(error);

        await expect(fetchUserById('user-404')(dispatch)).rejects.toThrow(errorMessage);
        expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });

  describe('toggleUserStatusAction', () => {
    const actionPayload = { 
        userId: 'user-1', 
        action: 'suspend', 
        value: true, 
        reason: 'Violation', 
        isSend: true 
    };

    it('should dispatch updateUserSuccess on successful API call', async () => {
      const response = { data: { id: 'user-1', name: 'User One', status: 'SUSPENDED' } };
      userManagementApi.toggleUserStatus.mockResolvedValue(response);

      await toggleUserStatusAction(actionPayload)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(operationStart());
      expect(userManagementApi.toggleUserStatus).toHaveBeenCalledWith(
        actionPayload.userId,
        actionPayload.action,
        actionPayload.value,
        actionPayload.reason,
        actionPayload.isSend
      );
      expect(dispatch).toHaveBeenCalledWith(updateUserSuccess(response.data));
    });

    it('should dispatch fail on API error', async () => {
        const errorMessage = 'Failed to update status';
        const error = { response: { data: { message: errorMessage } } };
        userManagementApi.toggleUserStatus.mockRejectedValue(error);

        await expect(toggleUserStatusAction(actionPayload)(dispatch)).rejects.toThrow(errorMessage);
        expect(dispatch).toHaveBeenCalledWith(operationFail({ error: errorMessage }));
    });
  });
});