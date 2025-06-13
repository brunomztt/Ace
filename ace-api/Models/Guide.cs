using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("guide")]
public class Guide
{
    [Key] [Column("guide_id")] public int GuideId { get; set; }

    [Column("user_id")] public int? UserId { get; set; }

    [Column("title")]
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = null!;

    [Column("content")] [Required] public string Content { get; set; } = null!;

    [Column("guide_type")]
    [Required]
    [StringLength(20)]
    public string GuideType { get; set; } = "Other";

    [Column("created_at")] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [ForeignKey("UserId")] public virtual User? User { get; set; }
}