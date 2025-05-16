using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ace_api.Models;

[Table("map")]
public class Map
{
    [Key] [Column("map_id")] public int MapId { get; set; }

    [Column("map_name")]
    [Required]
    [StringLength(50)]
    public string MapName { get; set; } = null!;

    [Column("map_description")] public string? MapDescription { get; set; }

    [Column("map_image")]
    public string? MapImage { get; set; }
}
