namespace ace_api.DTOs;

public class CommentDto
{
    public int CommentId { get; set; }
    public string CommentText { get; set; } = null!;
    public DateTime CommentDate { get; set; }
    public UserSummaryDto? Author { get; set; }
}