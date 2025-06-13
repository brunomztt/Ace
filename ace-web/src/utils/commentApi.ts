import { CommentDto, CommentCreateDto, CommentReviewDto } from '../models/Comment';
import { ApiResponse } from '../models/ApiResponse';
import api from './apiClient';

export const commentApi = {
    getCommentsByEntity: async (entityType: string, entityId: number | string): Promise<ApiResponse<CommentDto[]>> => {
        return api.get<ApiResponse<CommentDto[]>>(`/comments/${entityType}/${entityId}`);
    },

    getUserComments: async (userId: number | string): Promise<ApiResponse<CommentDto[]>> => {
        return api.get<ApiResponse<CommentDto[]>>(`/comments/user/${userId}`);
    },

    getPendingComments: async (): Promise<ApiResponse<CommentDto[]>> => {
        return api.get<ApiResponse<CommentDto[]>>('/comments/pending');
    },

    addComment: async (commentData: CommentCreateDto): Promise<ApiResponse<CommentDto>> => {
        return api.post<ApiResponse<CommentDto>>('/comments', commentData);
    },

    reviewComment: async (commentId: number, reviewData: CommentReviewDto): Promise<ApiResponse<CommentDto>> => {
        return api.put<ApiResponse<CommentDto>>(`/comments/${commentId}/review`, reviewData);
    },

    deleteComment: async (commentId: number | string): Promise<ApiResponse<boolean>> => {
        return api.delete<ApiResponse<boolean>>(`/comments/${commentId}`);
    },
};

export default commentApi;
