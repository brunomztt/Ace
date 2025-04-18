using ace_api.DTOs;
using ace_api.Services;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ace_api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AgentsController : ControllerBase
{
    private readonly IAgentService _agentService;

    public AgentsController(IAgentService agentService)
    {
        _agentService = agentService;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<AgentDto>>>> GetAllAgents()
    {
        var response = await _agentService.GetAllAgentsAsync();
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<AgentDto>>> GetAgentById(int id)
    {
        var response = await _agentService.GetAgentByIdAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
}