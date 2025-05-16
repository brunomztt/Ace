import { WeaponDto, WeaponCreateDto, WeaponUpdateDto, WeaponCategoryDto } from '../models/Weapon';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const weaponApi = {
    getAllWeapons: async (): Promise<ApiResponse<WeaponDto[]>> => {
        return api.get<ApiResponse<WeaponDto[]>>('/weapons');
    },

    getWeaponById: async (weaponId: string): Promise<ApiResponse<WeaponDto>> => {
        return api.get<ApiResponse<WeaponDto>>(`/weapons/${weaponId}`);
    },

    getAllWeaponCategories: async (): Promise<ApiResponse<WeaponCategoryDto[]>> => {
        return api.get<ApiResponse<WeaponCategoryDto[]>>('/weapons/categories');
    },

    createWeapon: async (weaponData: WeaponCreateDto): Promise<ApiResponse<WeaponDto>> => {
        return api.post<ApiResponse<WeaponDto>>('/weapons', weaponData);
    },

    updateWeapon: async (weaponId: string, updateData: WeaponUpdateDto): Promise<ApiResponse<WeaponDto>> => {
        return api.put<ApiResponse<WeaponDto>>(`/weapons/${weaponId}`, updateData);
    },

    deleteWeapon: async (weaponId: string): Promise<ApiResponse<boolean>> => {
        return api.delete<ApiResponse<boolean>>(`/weapons/${weaponId}`);
    },
};

export default weaponApi;
