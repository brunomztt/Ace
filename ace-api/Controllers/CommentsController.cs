using System.Security.Claims;
using ace_api.DTOs;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("{entityType}/{entityId}")]
    public async Task<ActionResult<ApiResponse<List<CommentDto>>>> GetCommentsByEntity(string entityType, int entityId)
    {
        var userId = User.Identity?.IsAuthenticated == true 
            ? int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0") 
            : (int?)null;
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        var response = await _commentService.GetCommentsByEntityAsync(entityType, entityId, userId, userRole);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<List<CommentDto>>>> GetUserComments(int userId)
    {
        var requestingUserId = User.Identity?.IsAuthenticated == true 
            ? int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0") 
            : (int?)null;
        var requestingUserRole = User.FindFirst(ClaimTypes.Role)?.Value;

        var response = await _commentService.GetUserCommentsAsync(userId, requestingUserId, requestingUserRole);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpGet("pending")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<List<CommentDto>>>> GetPendingComments()
    {
        var response = await _commentService.GetPendingCommentsAsync();
        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<CommentDto>>> AddComment([FromBody] CommentCreateDto commentDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ValidationErrorResponse
            {
                Errors = ModelState.ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>())
            });
        }

        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var response = await _commentService.AddCommentAsync(userId, commentDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPut("{commentId}/review")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<CommentDto>>> ReviewComment(int commentId, [FromBody] CommentReviewDto reviewDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ValidationErrorResponse
            {
                Errors = ModelState.ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray() ?? Array.Empty<string>())
            });
        }

        var reviewerId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var response = await _commentService.ReviewCommentAsync(commentId, reviewerId, reviewDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{commentId}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteComment(int commentId)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var response = await _commentService.DeleteCommentAsync(commentId, userId);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}