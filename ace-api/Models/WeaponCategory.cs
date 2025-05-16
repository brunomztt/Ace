using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("weapon_category")]
public class WeaponCategory
{
    [Key]
    [Column("category_id")]
    public int CategoryId { get; set; }

    [Column("category_name")]
    [Required]
    [StringLength(50)]
    public string CategoryName { get; set; } = null!;

    public ICollection<Weapon> Weapons { get; set; } = new List<Weapon>();
}