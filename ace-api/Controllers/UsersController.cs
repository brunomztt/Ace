using System.Security.Claims;
using ace_api.DTOs;
using ace_api.Services;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<List<UserDto>>>> GetAllUsers()
    {
        var response = await _userService.GetAllUsersAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetUserById(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (id != userId && userRole != "Admin" && userRole != "Moderator")
        {
            return Forbid();
        }

        var response = await _userService.GetUserByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetUserProfile()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var response = await _userService.GetUserByIdAsync(userId);

        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(int id, [FromBody] UserUpdateDto updateDto)
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
        var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

        if (id != userId && userRole != "Admin")
        {
            return Forbid();
        }

        var response = await _userService.UpdateUserAsync(id, updateDto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteUser(int id)
    {
        var response = await _userService.DeleteUserAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
}