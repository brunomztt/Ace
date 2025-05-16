namespace ace_api.DTOs;

public class SkinCreateDto
{
    public string SkinName { get; set; } = null!;
    public int WeaponId { get; set; }
    public string? SkinImage { get; set; }
    public string? Description { get; set; }
}