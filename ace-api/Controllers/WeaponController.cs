using ace_api.DTOs;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class WeaponsController : ControllerBase
{
    private readonly IWeaponService _weaponService;

    public WeaponsController(IWeaponService weaponService)
    {
        _weaponService = weaponService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<WeaponDto>>>> GetAllWeapons()
    {
        var response = await _weaponService.GetAllWeaponsAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<WeaponDto>>> GetWeaponById(int id)
    {
        var response = await _weaponService.GetWeaponByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<ApiResponse<List<WeaponCategoryDto>>>> GetAllWeaponCategories()
    {
        var response = await _weaponService.GetAllWeaponCategoriesAsync();
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<WeaponDto>>> CreateWeapon([FromBody] WeaponCreateDto weaponDto)
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

        var response = await _weaponService.CreateWeaponAsync(weaponDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<WeaponDto>>> UpdateWeapon(int id, [FromBody] WeaponUpdateDto weaponDto)
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

        var response = await _weaponService.UpdateWeaponAsync(id, weaponDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteWeapon(int id)
    {
        var response = await _weaponService.DeleteWeaponAsync(id);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}