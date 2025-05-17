import { SkinDto, SkinCreateDto, SkinUpdateDto } from '../models/Skin';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const skinApi = {
    getAllSkins: async (searchTerm?: string, weaponId?: number): Promise<ApiResponse<SkinDto[]>> => {
        const params: any = {};
        if (searchTerm) params.searchTerm = searchTerm;
        if (weaponId) params.weaponId = weaponId;
        return api.get<ApiResponse<SkinDto[]>>('/skins', { params });
    },

    getSkinById: async (skinId: string): Promise<ApiResponse<SkinDto>> => {
        return api.get<ApiResponse<SkinDto>>(`/skins/${skinId}`);
    },

    getSkinsByWeaponId: async (weaponId: string): Promise<ApiResponse<SkinDto[]>> => {
        return api.get<ApiResponse<SkinDto[]>>(`/skins/weapon/${weaponId}`);
    },

    createSkin: async (skinData: SkinCreateDto): Promise<ApiResponse<SkinDto>> => {
        return api.post<ApiResponse<SkinDto>>('/skins', skinData);
    },

    updateSkin: async (skinId: string, updateData: SkinUpdateDto): Promise<ApiResponse<SkinDto>> => {
        return api.put<ApiResponse<SkinDto>>(`/skins/${skinId}`, updateData);
    },

    deleteSkin: async (skinId: string): Promise<ApiResponse<boolean>> => {
        return api.delete<ApiResponse<boolean>>(`/skins/${skinId}`);
    },
};

export default skinApi;
