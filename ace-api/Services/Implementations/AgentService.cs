using ace_api.Data;
using ace_api.DTOs;
using ace_api.Models;
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

    public async Task<ApiResponse<List<AgentDto>>> GetAllAgentsAsync(string? searchTerm = null)
    {
        IQueryable<Agent> query = _context.Agents
            .Include(a => a.AgentVideos);
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(a => a.AgentName.Contains(searchTerm));
        }
    
        var agents = await query
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
    
    public async Task<ApiResponse<AgentDto>> UpdateAgentAsync(int agentId, AgentUpdateDto agentUpdateDto)
    {
        var agent = await _context.Agents
            .Include(a => a.AgentVideos)
            .FirstOrDefaultAsync(a => a.AgentId == agentId);

        if (agent == null)
        {
            return ApiResponse<AgentDto>.ErrorResponse("Agente não encontrado");
        }

        agent.AgentName = agentUpdateDto.AgentName ?? agent.AgentName;
        agent.AgentDescription = agentUpdateDto.AgentDescription ?? agent.AgentDescription;
        agent.AbilityOne = agentUpdateDto.AbilityOne ?? agent.AbilityOne;
        agent.AbilityOneDescription = agentUpdateDto.AbilityOneDescription ?? agent.AbilityOneDescription;
        agent.AbilityTwo = agentUpdateDto.AbilityTwo ?? agent.AbilityTwo;
        agent.AbilityTwoDescription = agentUpdateDto.AbilityTwoDescription ?? agent.AbilityTwoDescription;
        agent.AbilityThree = agentUpdateDto.AbilityThree ?? agent.AbilityThree;
        agent.AbilityThreeDescription = agentUpdateDto.AbilityThreeDescription ?? agent.AbilityThreeDescription;
        agent.Ultimate = agentUpdateDto.Ultimate ?? agent.Ultimate;
        agent.UltimateDescription = agentUpdateDto.UltimateDescription ?? agent.UltimateDescription;
        agent.AgentImage = agentUpdateDto.AgentImage ?? agent.AgentImage;

        if (agentUpdateDto.Videos != null && agentUpdateDto.Videos.Count > 0)
        {
            foreach (var video in agent.AgentVideos)
            {
                var updatedVideo = agentUpdateDto.Videos.FirstOrDefault(v => v.VideoId == video.VideoId);
                if (updatedVideo != null)
                {
                    video.YoutubeLink = updatedVideo.YoutubeLink;
                }
            }
        }

        await _context.SaveChangesAsync();

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
            Videos = new List<AgentVideoDto>(
                agent.AgentVideos.Select(v => new AgentVideoDto
                {
                    VideoId = v.VideoId,
                    YoutubeLink = v.YoutubeLink
                })
            )
        });
    }
    
    public async Task<ApiResponse<bool>> DeleteAgentAsync(int agentId)
    {
        var agent = await _context.Agents
            .Include(a => a.AgentVideos)
            .FirstOrDefaultAsync(a => a.AgentId == agentId);

        if (agent == null)
        {
            return ApiResponse<bool>.ErrorResponse("Agente não encontrado");
        }

        _context.Agents.Remove(agent);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true);
    }

    public async Task<ApiResponse<AgentDto>> CreateAgentAsync(AgentCreateDto agentCreateDto)
    {
        var agent = new Agent
        {
            AgentName = agentCreateDto.AgentName,
            AgentDescription = agentCreateDto.AgentDescription,
            AbilityOne = agentCreateDto.AbilityOne,
            AbilityOneDescription = agentCreateDto.AbilityOneDescription,
            AbilityTwo = agentCreateDto.AbilityTwo,
            AbilityTwoDescription = agentCreateDto.AbilityTwoDescription,
            AbilityThree = agentCreateDto.AbilityThree,
            AbilityThreeDescription = agentCreateDto.AbilityThreeDescription,
            Ultimate = agentCreateDto.Ultimate,
            UltimateDescription = agentCreateDto.UltimateDescription,
            AgentImage = agentCreateDto.AgentImage
        };

        if (agentCreateDto.Videos != null && agentCreateDto.Videos.Count > 0)
        {
            foreach (var video in agentCreateDto.Videos)
            {
                var newVideo = new AgentVideo
                {
                    YoutubeLink = video.YoutubeLink
                };
                agent.AgentVideos.Add(newVideo);
            }
        }

        _context.Agents.Add(agent);
        await _context.SaveChangesAsync();

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
            Videos = new List<AgentVideoDto>(
                agent.AgentVideos.Select(v => new AgentVideoDto
                {
                    VideoId = v.VideoId,
                    YoutubeLink = v.YoutubeLink
                })
            )
        });
    }
}
