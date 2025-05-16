using ace_api.DTOs;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SkinsController : ControllerBase
{
    private readonly ISkinService _skinService;

    public SkinsController(ISkinService skinService)
    {
        _skinService = skinService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<SkinDto>>>> GetAllSkins()
    {
        var response = await _skinService.GetAllSkinsAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<SkinDto>>> GetSkinById(int id)
    {
        var response = await _skinService.GetSkinByIdAsync(id);
        return Ok(response);
    }

    [HttpGet("weapon/{weaponId}")]
    public async Task<ActionResult<ApiResponse<List<SkinDto>>>> GetSkinsByWeaponId(int weaponId)
    {
        var response = await _skinService.GetSkinsByWeaponIdAsync(weaponId);
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<SkinDto>>> CreateSkin([FromBody] SkinCreateDto skinDto)
    {
        var response = await _skinService.CreateSkinAsync(skinDto);
        return Ok(response);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<SkinDto>>> UpdateSkin(int id, [FromBody] SkinUpdateDto skinDto)
    {
        var response = await _skinService.UpdateSkinAsync(id, skinDto);
        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteSkin(int id)
    {
        var response = await _skinService.DeleteSkinAsync(id);
        return Ok(response);
    }
}