namespace ace_api.DTOs;

public class WeaponDto
{
    public int WeaponId { get; set; }
    public string WeaponName { get; set; } = null!;
    public int CategoryId { get; set; }
    public int Credits { get; set; }
    public string WallPenetration { get; set; } = null!;
    public string? WeaponImage { get; set; }
    public string? WeaponDescription { get; set; }
    public string? FireMode { get; set; }
    public decimal? FireRate { get; set; }
    public decimal? RunSpeed { get; set; }
    public decimal? EquipSpeed { get; set; }
    public decimal? ReloadSpeed { get; set; }
    public int? MagazineSize { get; set; }
    public int? ReserveAmmo { get; set; }
    public decimal? FirstShotSpread { get; set; }
    public int? DamageHeadClose { get; set; }
    public int? DamageBodyClose { get; set; }
    public int? DamageLegClose { get; set; }
    public int? DamageHeadFar { get; set; }
    public int? DamageBodyFar { get; set; }
    public int? DamageLegFar { get; set; }
    public WeaponCategoryDto? Category { get; set; }
}

public class WeaponCreateDto
{
    public string WeaponName { get; set; } = null!;
    public int CategoryId { get; set; }
    public int Credits { get; set; }
    public string WallPenetration { get; set; } = null!;
    public string? WeaponImage { get; set; }
    public string? WeaponDescription { get; set; }
    public string? FireMode { get; set; }
    public decimal? FireRate { get; set; }
    public decimal? RunSpeed { get; set; }
    public decimal? EquipSpeed { get; set; }
    public decimal? ReloadSpeed { get; set; }
    public int? MagazineSize { get; set; }
    public int? ReserveAmmo { get; set; }
    public decimal? FirstShotSpread { get; set; }
    public int? DamageHeadClose { get; set; }
    public int? DamageBodyClose { get; set; }
    public int? DamageLegClose { get; set; }
    public int? DamageHeadFar { get; set; }
    public int? DamageBodyFar { get; set; }
    public int? DamageLegFar { get; set; }
}

public class WeaponUpdateDto
{
    public string WeaponName { get; set; } = null!;
    public int CategoryId { get; set; }
    public int Credits { get; set; }
    public string WallPenetration { get; set; } = null!;
    public string? WeaponImage { get; set; }
    public string? WeaponDescription { get; set; }
    public string? FireMode { get; set; }
    public decimal? FireRate { get; set; }
    public decimal? RunSpeed { get; set; }
    public decimal? EquipSpeed { get; set; }
    public decimal? ReloadSpeed { get; set; }
    public int? MagazineSize { get; set; }
    public int? ReserveAmmo { get; set; }
    public decimal? FirstShotSpread { get; set; }
    public int? DamageHeadClose { get; set; }
    public int? DamageBodyClose { get; set; }
    public int? DamageLegClose { get; set; }
    public int? DamageHeadFar { get; set; }
    public int? DamageBodyFar { get; set; }
    public int? DamageLegFar { get; set; }
}

public class WeaponCategoryDto
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
}