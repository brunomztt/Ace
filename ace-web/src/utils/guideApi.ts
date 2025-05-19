import { GuideDto, GuideCreateDto } from '../models/Guide';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const guideApi = {
    getAllGuides: async (searchTerm?: string, guideType?: string): Promise<ApiResponse<GuideDto[]>> => {
        const params: any = {};
        if (searchTerm) params.searchTerm = searchTerm;
        if (guideType) params.guideType = guideType;
        return api.get<ApiResponse<GuideDto[]>>('/guides', { params });
    },

    getGuideById: async (guideId: string): Promise<ApiResponse<GuideDto>> => {
        return api.get<ApiResponse<GuideDto>>(`/guides/${guideId}`);
    },

    createGuide: async (guideData: GuideCreateDto): Promise<ApiResponse<GuideDto>> => {
        return api.post<ApiResponse<GuideDto>>('/guides', guideData);
    },

    updateGuide: async (guideId: string, updateData: GuideCreateDto): Promise<ApiResponse<GuideDto>> => {
        return api.put<ApiResponse<GuideDto>>(`/guides/${guideId}`, updateData);
    },

    deleteGuide: async (guideId: string): Promise<ApiResponse<boolean>> => {
        return api.delete<ApiResponse<boolean>>(`/guides/${guideId}`);
    },
};

export default guideApi;
