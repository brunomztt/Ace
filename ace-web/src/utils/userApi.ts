import { UserDto, UserUpdateDto } from '../models/User';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const userApi = {
    getAllUsers: async (searchTerm?: string): Promise<ApiResponse<UserDto[]>> => {
        const params = searchTerm ? { searchTerm } : {};
        return api.get<ApiResponse<UserDto[]>>('/users', { params });
    },

    getUserById: async (userId: string): Promise<ApiResponse<UserDto>> => {
        return api.get<ApiResponse<UserDto>>(`/users/${userId}`);
    },

    updateUser: async (userId: string, updateData: UserUpdateDto): Promise<ApiResponse<UserDto>> => {
        return api.put<ApiResponse<UserDto>>(`/users/${userId}`, updateData);
    },

    deleteUser: async (userId: string): Promise<ApiResponse<null>> => {
        return api.delete<ApiResponse<null>>(`/users/${userId}`);
    },
};

export default userApi;
