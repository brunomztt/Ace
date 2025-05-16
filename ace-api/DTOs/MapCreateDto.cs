namespace ace_api.DTOs;

public class MapCreateDto
{
    public string MapName { get; set; } = null!;
    public string? MapDescription { get; set; }
    public string? MapImage { get; set; }
}