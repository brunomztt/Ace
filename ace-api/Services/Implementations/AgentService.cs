using ace_api.Data;
using ace_api.DTOs;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Services.Implementations;

public class AgentService : IAgentService
{
    private readonly AceDbContext _context;

    public AgentService(AceDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<AgentDto>>> GetAllAgentsAsync()
    {
        var agents = await _context.Agents
            .Include(a => a.AgentVideos)
            .Select(a => new AgentDto
            {
                AgentId = a.AgentId,
                AgentName = a.AgentName,
                AgentDescription = a.AgentDescription,
                AbilityOne = a.AbilityOne,
                AbilityOneDescription = a.AbilityOneDescription,
                AbilityTwo = a.AbilityTwo,
                AbilityTwoDescription = a.AbilityTwoDescription,
                AbilityThree = a.AbilityThree,
                AbilityThreeDescription = a.AbilityThreeDescription,
                Ultimate = a.Ultimate,
                UltimateDescription = a.UltimateDescription,
                AgentImage = a.AgentImage,
                Videos = a.AgentVideos.Select(v => new AgentVideoDto
                {
                    VideoId = v.VideoId,
                    YoutubeLink = v.YoutubeLink
                }).ToList()
            })
            .ToListAsync();

        return ApiResponse<List<AgentDto>>.SuccessResponse(agents);
    }

    public async Task<ApiResponse<AgentDto>> GetAgentByIdAsync(int agentId)
    {
        var agent = await _context.Agents
            .Include(a => a.AgentVideos)
            .FirstOrDefaultAsync(a => a.AgentId == agentId);

        if (agent == null)
        {
            return ApiResponse<AgentDto>.ErrorResponse("Agente não encontrado");
        }

        return ApiResponse<AgentDto>.SuccessResponse(new AgentDto
        {
            AgentId = agent.AgentId,
            AgentName = agent.AgentName,
            AgentDescription = agent.AgentDescription,
            AbilityOne = agent.AbilityOne,
            AbilityOneDescription = agent.AbilityOneDescription,
            AbilityTwo = agent.AbilityTwo,
            AbilityTwoDescription = agent.AbilityTwoDescription,
            AbilityThree = agent.AbilityThree,
            AbilityThreeDescription = agent.AbilityThreeDescription,
            Ultimate = agent.Ultimate,
            UltimateDescription = agent.UltimateDescription,
            AgentImage = agent.AgentImage,
            Videos = agent.AgentVideos.Select(v => new AgentVideoDto
            {
                VideoId = v.VideoId,
                YoutubeLink = v.YoutubeLink
            }).ToList()
        });
    }
}
