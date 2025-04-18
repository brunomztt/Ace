using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("agent_video")]
public class AgentVideo
{
    [Key] [Column("video_id")] public int VideoId { get; set; }

    [Column("agent_id")] public int? AgentId { get; set; }

    [Column("youtube_link")]
    [Required]
    [StringLength(255)]
    public string YoutubeLink { get; set; } = null!;

    [ForeignKey("AgentId")] public virtual Agent? Agent { get; set; }
}