using ace_api.DTOs;
using ace_api.Services;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class RolesController : ControllerBase
{
    private readonly IRoleService _roleService;

    public RolesController(IRoleService roleService)
    {
        _roleService = roleService;
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<List<RoleDto>>>> GetAllRoles()
    {
        var response = await _roleService.GetAllRolesAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<RoleDto>>> GetRoleById(int id)
    {
        var response = await _roleService.GetRoleByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
}