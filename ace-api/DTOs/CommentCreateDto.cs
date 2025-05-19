namespace ace_api.DTOs;

public class CommentCreateDto
{
    public string EntityType { get; set; } = null!;
    public int EntityId { get; set; }
    public string CommentText { get; set; } = null!;
}