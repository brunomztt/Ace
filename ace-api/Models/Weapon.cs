using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("weapon")]
public class Weapon
{
    [Key]
    [Column("weapon_id")]
    public int WeaponId { get; set; }

    [Column("weapon_name")]
    [Required]
    [StringLength(50)]
    public string WeaponName { get; set; } = null!;

    [Column("category_id")]
    [ForeignKey(nameof(Category))]
    public int CategoryId { get; set; }

    [Column("credits")]
    [Required]
    public int Credits { get; set; }

    [Column("wall_penetration")]
    [Required]
    public string WallPenetration { get; set; } = null!; // "Low", "Medium" ou "High"

    [Column("weapon_image", TypeName = "LONGTEXT")]
    public string? WeaponImage { get; set; }

    [Column("weapon_description")]
    public string? WeaponDescription { get; set; }

    [Column("fire_mode")]
    [StringLength(50)]
    public string? FireMode { get; set; }

    [Column("fire_rate", TypeName = "decimal(5,2)")]
    public decimal? FireRate { get; set; }

    [Column("run_speed", TypeName = "decimal(5,2)")]
    public decimal? RunSpeed { get; set; }

    [Column("equip_speed", TypeName = "decimal(5,2)")]
    public decimal? EquipSpeed { get; set; }

    [Column("reload_speed", TypeName = "decimal(5,2)")]
    public decimal? ReloadSpeed { get; set; }

    [Column("magazine_size")]
    public int? MagazineSize { get; set; }

    [Column("reserve_ammo")]
    public int? ReserveAmmo { get; set; }

    [Column("first_shot_spread", TypeName = "decimal(5,2)")]
    public decimal? FirstShotSpread { get; set; }

    [Column("damage_head_close")]
    public int? DamageHeadClose { get; set; }

    [Column("damage_body_close")]
    public int? DamageBodyClose { get; set; }

    [Column("damage_leg_close")]
    public int? DamageLegClose { get; set; }

    [Column("damage_head_far")]
    public int? DamageHeadFar { get; set; }

    [Column("damage_body_far")]
    public int? DamageBodyFar { get; set; }

    [Column("damage_leg_far")]
    public int? DamageLegFar { get; set; }

    public WeaponCategory Category { get; set; } = null!;
}