import { LoginResponseDto, UserDto, UserLoginDto, UserRegistrationDto } from '../models/User';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const authApi = {
    register: async (userData: UserRegistrationDto): Promise<ApiResponse<UserDto>> => {
        return api.post<ApiResponse<UserDto>>('/auth/register', userData);
    },

    login: async (credentials: UserLoginDto): Promise<ApiResponse<LoginResponseDto>> => {
        const response = await api.post<ApiResponse<LoginResponseDto>>('/auth/login', credentials);
        if (response.success && response.data) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem(
                'user',
                JSON.stringify({
                    userId: response.data.userId,
                    nickname: response.data.nickname,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    profilePic: response.data.profilePic,
                    email: response.data.email,
                    roleName: response.data.roleName,
                })
            );
        }
        return response;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getAuthToken: () => {
        return localStorage.getItem('token');
    },

    updateUserData: (userData: Partial<UserDto>) => {
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            const updatedUser = { ...currentUser, ...userData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            window.dispatchEvent(new CustomEvent('userDataUpdated'));
        }
    },

    updateProfileImage: (profilePic: string | null) => {
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            currentUser.profilePic = profilePic === undefined ? null : profilePic;
            localStorage.setItem('user', JSON.stringify(currentUser));
            window.dispatchEvent(new CustomEvent('userDataUpdated'));
        }
    },

    updateBannerImage: (bannerImg: string | null) => {
        const currentUserStr = localStorage.getItem('user');
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            currentUser.bannerImg = bannerImg;
            localStorage.setItem('user', JSON.stringify(currentUser));
            window.dispatchEvent(new CustomEvent('userDataUpdated'));
        }
    },
};

export default authApi;
