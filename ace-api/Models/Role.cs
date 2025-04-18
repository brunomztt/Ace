using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("role")]
public class Role
{
    [Key] [Column("role_id")] public int RoleId { get; set; }

    [Column("role_name")]
    [Required]
    [StringLength(50)]
    public string RoleName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}