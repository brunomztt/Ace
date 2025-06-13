namespace ace_api.DTOs;

using System.ComponentModel.DataAnnotations;

public class CommentReviewDto
{
    [Required]
    public bool Approve { get; set; }

    [StringLength(255)]
    public string? RejectedReason { get; set; }
}