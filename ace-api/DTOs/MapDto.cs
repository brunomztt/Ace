namespace ace_api.DTOs;

public class MapDto
{
    public int MapId { get; set; }
    public string MapName { get; set; } = null!;
    public string? MapDescription { get; set; }
    public string? MapImage { get; set; }
}