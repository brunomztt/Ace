namespace ace_api.DTOs;

public class GuideDto
{
    public int GuideId { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string GuideType { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public UserSummaryDto? Author { get; set; }
}