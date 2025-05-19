using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface ICommentService
{
    Task<ApiResponse<List<CommentDto>>> GetCommentsByEntityAsync(string entityType, int entityId);
    Task<ApiResponse<CommentDto>> AddCommentAsync(int userId, CommentCreateDto commentDto);
    Task<ApiResponse<bool>> DeleteCommentAsync(int commentId, int userId);
}