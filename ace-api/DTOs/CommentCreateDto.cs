using System.ComponentModel.DataAnnotations;

namespace ace_api.DTOs;

public class CommentCreateDto
{
    [Required]
    [StringLength(20)]
    public string EntityType { get; set; } = null!;

    [Required]
    public int EntityId { get; set; }

    [Required]
    [StringLength(500)]
    public string CommentText { get; set; } = null!;
}