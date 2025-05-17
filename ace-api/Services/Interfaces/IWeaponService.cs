using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface IWeaponService
{
    Task<ApiResponse<List<WeaponDto>>> GetAllWeaponsAsync(string? searchTerm = null, int? categoryId = null);
    Task<ApiResponse<WeaponDto>> GetWeaponByIdAsync(int weaponId);
    Task<ApiResponse<WeaponDto>> CreateWeaponAsync(WeaponCreateDto weaponDto);
    Task<ApiResponse<WeaponDto>> UpdateWeaponAsync(int weaponId, WeaponUpdateDto weaponDto);
    Task<ApiResponse<bool>> DeleteWeaponAsync(int weaponId);
    Task<ApiResponse<List<WeaponCategoryDto>>> GetAllWeaponCategoriesAsync();
}