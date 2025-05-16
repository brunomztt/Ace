namespace ace_api.DTOs;

public class MapUpdateDto
{
    public string MapName { get; set; } = null!;
    public string? MapDescription { get; set; }
    public string? MapImage { get; set; }
}