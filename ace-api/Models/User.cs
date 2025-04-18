using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("user")]
public class User
{
    [Key] [Column("user_id")] public int UserId { get; set; }

    [Column("role_id")] public int? RoleId { get; set; }

    [Column("is_enabled")] public bool IsEnabled { get; set; } = true;

    [Column("full_name")]
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = null!;

    [Column("nickname")]
    [Required]
    [StringLength(50)]
    public string Nickname { get; set; } = null!;

    [Column("cpf")]
    [Required]
    [StringLength(11)]
    public string Cpf { get; set; } = null!;

    [Column("phone_number")]
    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    [Column("email")]
    [Required]
    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Column("password")]
    [Required]
    [StringLength(100)]
    public string Password { get; set; } = null!;

    [Column("address_id")] public int? AddressId { get; set; }

    [ForeignKey("RoleId")] public virtual Role? Role { get; set; }

    [ForeignKey("AddressId")] public virtual Address? Address { get; set; }

    public virtual ICollection<Guide> Guides { get; set; } = new List<Guide>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
}