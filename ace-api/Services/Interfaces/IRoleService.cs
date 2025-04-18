using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface IRoleService
{
    Task<ApiResponse<List<RoleDto>>> GetAllRolesAsync();
    Task<ApiResponse<RoleDto>> GetRoleByIdAsync(int roleId);
}