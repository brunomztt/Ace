namespace ace_api.DTOs;

public class AgentDto
{
    public int AgentId { get; set; }
    public string AgentName { get; set; } = null!;
    public string? AgentDescription { get; set; }
    public string? AbilityOne { get; set; }
    public string? AbilityOneDescription { get; set; }
    public string? AbilityTwo { get; set; }
    public string? AbilityTwoDescription { get; set; }
    public string? AbilityThree { get; set; }
    public string? AbilityThreeDescription { get; set; }
    public string? Ultimate { get; set; }
    public string? UltimateDescription { get; set; }
    public string? AgentImage { get; set; }
    public List<AgentVideoDto>? Videos { get; set; }
}