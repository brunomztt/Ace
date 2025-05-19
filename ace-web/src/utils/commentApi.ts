import { CommentDto, CommentCreateDto } from '../models/Comment';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const commentApi = {
    getCommentsByEntity: async (entityType: string, entityId: string): Promise<ApiResponse<CommentDto[]>> => {
        return api.get<ApiResponse<CommentDto[]>>(`/comments/${entityType}/${entityId}`);
    },

    addComment: async (commentData: CommentCreateDto): Promise<ApiResponse<CommentDto>> => {
        return api.post<ApiResponse<CommentDto>>('/comments', commentData);
    },

    deleteComment: async (commentId: string): Promise<ApiResponse<boolean>> => {
        return api.delete<ApiResponse<boolean>>(`/comments/${commentId}`);
    },
};

export default commentApi;
