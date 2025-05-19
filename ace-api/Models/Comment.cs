using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("comment")]
public class Comment
{
    [Key] [Column("comment_id")] public int CommentId { get; set; }

    [Column("entity_type")] [Required] public string EntityType { get; set; } = null!;

    [Column("entity_id")] [Required] public int EntityId { get; set; }

    [Column("user_id")] public int? UserId { get; set; }

    [Column("comment_text")] [Required] public string CommentText { get; set; } = null!;

    [Column("comment_date")] public DateTime CommentDate { get; set; } = DateTime.UtcNow;

    [ForeignKey("UserId")] public virtual User? User { get; set; }
}