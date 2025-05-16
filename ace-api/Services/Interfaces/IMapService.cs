using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface IMapService
{
    Task<ApiResponse<List<MapDto>>> GetAllMapsAsync();
    Task<ApiResponse<MapDto>> GetMapByIdAsync(int mapId);
    Task<ApiResponse<MapDto>> CreateMapAsync(MapCreateDto mapDto);
    Task<ApiResponse<MapDto>> UpdateMapAsync(int mapId, MapUpdateDto mapDto);
    Task<ApiResponse<bool>> DeleteMapAsync(int mapId);
}