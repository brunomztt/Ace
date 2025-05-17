using System.Security.Claims;
using ace_api.DTOs;
using ace_api.Services;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GuidesController : ControllerBase
{
    private readonly IGuideService _guideService;

    public GuidesController(IGuideService guideService)
    {
        _guideService = guideService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<GuideDto>>>> GetAllGuides([FromQuery] string? searchTerm = null, [FromQuery] string? guideType = null)
    {
        var response = await _guideService.GetAllGuidesAsync(searchTerm, guideType);
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<GuideDto>>> GetGuideById(int id)
    {
        var response = await _guideService.GetGuideByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpPost]
    [Authorize]
    public async Task<ActionResult<ApiResponse<GuideDto>>> CreateGuide([FromBody] GuideCreateDto guideDto)
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
        var response = await _guideService.CreateGuideAsync(userId, guideDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<GuideDto>>> UpdateGuide(int id, [FromBody] GuideCreateDto guideDto)
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
        var response = await _guideService.UpdateGuideAsync(id, userId, guideDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteGuide(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var response = await _guideService.DeleteGuideAsync(id, userId);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("comments")]
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
        var response = await _guideService.AddCommentAsync(userId, commentDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}