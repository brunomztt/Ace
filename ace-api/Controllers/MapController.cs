using ace_api.DTOs;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MapsController : ControllerBase
{
    private readonly IMapService _mapService;

    public MapsController(IMapService mapService)
    {
        _mapService = mapService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<MapDto>>>> GetAllMaps()
    {
        var response = await _mapService.GetAllMapsAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<MapDto>>> GetMapById(int id)
    {
        var response = await _mapService.GetMapByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<MapDto>>> CreateMap([FromBody] MapCreateDto mapDto)
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

        var response = await _mapService.CreateMapAsync(mapDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<MapDto>>> UpdateMap(int id, [FromBody] MapUpdateDto mapDto)
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

        var response = await _mapService.UpdateMapAsync(id, mapDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Moderator")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteMap(int id)
    {
        var response = await _mapService.DeleteMapAsync(id);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}