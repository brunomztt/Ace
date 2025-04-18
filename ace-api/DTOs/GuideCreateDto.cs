namespace ace_api.DTOs;

public class GuideCreateDto
{
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string GuideType { get; set; } = null!;
}