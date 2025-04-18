using ace_api.DTOs;
using ace_api.Services;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<UserDto>>> Register([FromBody] UserRegistrationDto registrationDto)
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

        var response = await _userService.RegisterUserAsync(registrationDto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] UserLoginDto loginDto)
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

        var response = await _userService.LoginAsync(loginDto);
        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}