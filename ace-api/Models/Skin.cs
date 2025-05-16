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

    [Column("skin_image")]
    public string? SkinImage { get; set; }

    [Column("description")] public string? Description { get; set; }
    
    [Column("weapon_id")]
    [ForeignKey(nameof(Weapon))]
    public int WeaponId { get; set; }
    
    public Weapon? Weapon { get; set; } = null!;
}