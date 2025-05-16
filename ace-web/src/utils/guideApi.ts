import { GuideDto, GuideCreateDto, CommentCreateDto, CommentDto } from '../models/Guide';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const guideApi = {
    getAllGuides: async (): Promise<ApiResponse<GuideDto[]>> => {
        return api.get<ApiResponse<GuideDto[]>>('/guides');
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

    addComment: async (commentData: CommentCreateDto): Promise<ApiResponse<CommentDto>> => {
        return api.post<ApiResponse<CommentDto>>('/guides/comments', commentData);
    },
};

export default guideApi;
