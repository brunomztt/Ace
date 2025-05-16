using ace_api.DTOs;

namespace ace_api.Services.Interfaces;

public interface IAgentService
{
    Task<ApiResponse<List<AgentDto>>> GetAllAgentsAsync();
    Task<ApiResponse<AgentDto>> GetAgentByIdAsync(int agentId);
    Task<ApiResponse<AgentDto>> UpdateAgentAsync(int agentId, AgentUpdateDto agentUpdateDto);
    Task<ApiResponse<bool>> DeleteAgentAsync(int agentId);
    Task<ApiResponse<AgentDto>> CreateAgentAsync(AgentCreateDto agentCreateDto);
}