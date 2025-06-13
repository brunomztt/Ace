using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface ICommentService
{
    Task<ApiResponse<List<CommentDto>>> GetCommentsByEntityAsync(string entityType, int entityId, int? userId = null, string? userRole = null);
    Task<ApiResponse<List<CommentDto>>> GetUserCommentsAsync(int userId, int? requestingUserId = null, string? requestingUserRole = null);
    Task<ApiResponse<CommentDto>> AddCommentAsync(int userId, CommentCreateDto commentDto);
    Task<ApiResponse<bool>> DeleteCommentAsync(int commentId, int userId);
    Task<ApiResponse<CommentDto>> ReviewCommentAsync(int commentId, int reviewerId, CommentReviewDto reviewDto);
    Task<ApiResponse<List<CommentDto>>> GetPendingCommentsAsync();
}