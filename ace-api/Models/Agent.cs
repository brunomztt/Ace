using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("agent")]
public class Agent
{
    [Key] [Column("agent_id")] public int AgentId { get; set; }

    [Column("agent_name")]
    [Required]
    [StringLength(50)]
    public string AgentName { get; set; } = null!;

    [Column("agent_description")] public string? AgentDescription { get; set; }

    [Column("ability_one")]
    [StringLength(50)]
    public string? AbilityOne { get; set; }

    [Column("ability_one_description")] public string? AbilityOneDescription { get; set; }

    [Column("ability_two")]
    [StringLength(50)]
    public string? AbilityTwo { get; set; }

    [Column("ability_two_description")] public string? AbilityTwoDescription { get; set; }

    [Column("ability_three")]
    [StringLength(50)]
    public string? AbilityThree { get; set; }

    [Column("ability_three_description")] public string? AbilityThreeDescription { get; set; }

    [Column("ultimate")]
    [StringLength(50)]
    public string? Ultimate { get; set; }

    [Column("ultimate_description")] public string? UltimateDescription { get; set; }

    [Column("agent_image")]
    public string? AgentImage { get; set; }

    public virtual ICollection<AgentVideo> AgentVideos { get; set; } = new List<AgentVideo>();
}