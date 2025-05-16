using ace_api.DTOs;
using ace_api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
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
    
    [HttpPut("{id}")]
    public async Task<ActionResult<ApiResponse<AgentDto>>> UpdateAgent(int id, [FromBody] AgentUpdateDto agentUpdateDto)
    {
        var response = await _agentService.UpdateAgentAsync(id, agentUpdateDto);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
    
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteAgent(int id)
    {
        var response = await _agentService.DeleteAgentAsync(id);
        if (!response.Success)
        {
            return NotFound(response);
        }

        return Ok(response);
    }
    
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<AgentDto>>> CreateAgent([FromBody] AgentCreateDto agentCreateDto)
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

        var response = await _agentService.CreateAgentAsync(agentCreateDto);

        if (!response.Success)
        {
            return BadRequest(response);
        }

        return Ok(response);
    }
}