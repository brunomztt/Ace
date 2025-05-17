using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface ISkinService
{
    Task<ApiResponse<List<SkinDto>>> GetAllSkinsAsync(string? searchTerm = null, int? weaponId = null);
    Task<ApiResponse<SkinDto>> GetSkinByIdAsync(int skinId);
    Task<ApiResponse<List<SkinDto>>> GetSkinsByWeaponIdAsync(int skinId);
    Task<ApiResponse<SkinDto>> CreateSkinAsync(SkinCreateDto skinDto);
    Task<ApiResponse<SkinDto>> UpdateSkinAsync(int skinId, SkinUpdateDto skinDto);
    Task<ApiResponse<bool>> DeleteSkinAsync(int skinId);
}