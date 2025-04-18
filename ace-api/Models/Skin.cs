using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("skin")]
public class Skin
{
    [Key] [Column("skin_id")] public int SkinId { get; set; }

    [Column("skin_name")]
    [Required]
    [StringLength(100)]
    public string SkinName { get; set; } = null!;

    [Column("skin_type")]
    [Required]
    [StringLength(20)]
    public string SkinType { get; set; } = "Weapon";

    [Column("skin_image")]
    [StringLength(255)]
    public string? SkinImage { get; set; }

    [Column("description")] public string? Description { get; set; }
}