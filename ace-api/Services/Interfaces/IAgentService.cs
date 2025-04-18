using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface IAgentService
{
    Task<ApiResponse<List<AgentDto>>> GetAllAgentsAsync();
    Task<ApiResponse<AgentDto>> GetAgentByIdAsync(int agentId);
}