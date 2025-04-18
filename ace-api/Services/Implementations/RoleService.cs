using ace_api.Data;
using ace_api.DTOs;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Services.Implementations;

public class RoleService : IRoleService
{
    private readonly AceDbContext _context;

    public RoleService(AceDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<RoleDto>>> GetAllRolesAsync()
    {
        var roles = await _context.Roles
            .Select(r => new RoleDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName
            })
            .ToListAsync();

        return ApiResponse<List<RoleDto>>.SuccessResponse(roles);
    }

    public async Task<ApiResponse<RoleDto>> GetRoleByIdAsync(int roleId)
    {
        var role = await _context.Roles.FindAsync(roleId);

        if (role == null)
        {
            return ApiResponse<RoleDto>.ErrorResponse("Cargo não encontrado");
        }

        return ApiResponse<RoleDto>.SuccessResponse(new RoleDto
        {
            RoleId = role.RoleId,
            RoleName = role.RoleName
        });
    }
}
