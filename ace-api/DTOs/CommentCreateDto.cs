namespace ace_api.DTOs;

public class CommentCreateDto
{
    public int GuideId { get; set; }
    public string CommentText { get; set; } = null!;
}