import api from './apiClient';

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface UserRegistrationDto {
    fullName: string;
    nickname: string;
    cpf: string;
    phoneNumber?: string;
    email: string;
    password: string;
    address?: AddressDto;
}

export interface AddressDto {
    street: string;
    district: string;
    zipCode: string;
    houseNumber: string;
    complement?: string;
}

export interface UserLoginDto {
    nickname: string;
    password: string;
}

export interface LoginResponseDto {
    userId: number;
    nickname: string;
    fullName: string;
    email: string;
    roleName: string;
    token: string;
}

export interface UserDto {
    userId: number;
    fullName: string;
    nickname: string;
    cpf: string;
    email: string;
    phoneNumber?: string;
    isEnabled: boolean;
    role?: RoleDto;
    address?: AddressDto;
}

export interface RoleDto {
    roleId: number;
    roleName: string;
}

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
                    fullName: response.data.fullName,
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
};

export default authApi;
