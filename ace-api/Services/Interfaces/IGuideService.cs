using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface IGuideService
{
    Task<ApiResponse<List<GuideDto>>> GetAllGuidesAsync(string? searchTerm = null, string? guideType = null);
    Task<ApiResponse<GuideDto>> GetGuideByIdAsync(int guideId);
    Task<ApiResponse<GuideDto>> CreateGuideAsync(int userId, GuideCreateDto guideDto);
    Task<ApiResponse<GuideDto>> UpdateGuideAsync(int guideId, int userId, GuideCreateDto guideDto);
    Task<ApiResponse<bool>> DeleteGuideAsync(int guideId, int userId);
}