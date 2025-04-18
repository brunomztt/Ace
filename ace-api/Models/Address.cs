using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("address")]
public class Address
{
    [Key] [Column("address_id")] public int AddressId { get; set; }

    [Column("street")]
    [Required]
    [StringLength(100)]
    public string Street { get; set; } = null!;

    [Column("district")]
    [Required]
    [StringLength(50)]
    public string District { get; set; } = null!;

    [Column("zip_code")]
    [Required]
    [StringLength(8)]
    public string ZipCode { get; set; } = null!;

    [Column("house_number")]
    [Required]
    [StringLength(10)]
    public string HouseNumber { get; set; } = null!;

    [Column("complement")]
    [StringLength(100)]
    public string? Complement { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}