using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface IUserService
{
    Task<ApiResponse<UserDto>> RegisterUserAsync(UserRegistrationDto registrationDto);
    Task<ApiResponse<LoginResponseDto>> LoginAsync(UserLoginDto loginDto);
    Task<ApiResponse<UserDto>> GetUserByIdAsync(int userId);
    Task<ApiResponse<List<UserDto>>> GetAllUsersAsync();
    Task<ApiResponse<UserDto>> UpdateUserAsync(int userId, UserUpdateDto updateDto);
    Task<ApiResponse<bool>> DeleteUserAsync(int userId);
}