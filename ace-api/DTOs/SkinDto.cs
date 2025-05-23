namespace ace_api.DTOs;

public class SkinDto
{
    public int SkinId { get; set; }
    public string SkinName { get; set; } = null!;
    public string? SkinImage { get; set; }
    public string? Description { get; set; }
    public int WeaponId { get; set; }
    public WeaponDto? Weapon { get; set; } = null!;
}