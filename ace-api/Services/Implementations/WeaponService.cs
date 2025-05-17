using ace_api.Data;
using ace_api.DTOs;
using ace_api.Models;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Services.Implementations;

public class WeaponService : IWeaponService
{
    private readonly AceDbContext _context;

    public WeaponService(AceDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<WeaponDto>>> GetAllWeaponsAsync(string? searchTerm = null, int? categoryId = null)
    {
        IQueryable<Weapon> query = _context.Weapons
            .Include(w => w.Category);
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(w => w.WeaponName.Contains(searchTerm));
        }
    
        if (categoryId.HasValue)
        {
            query = query.Where(w => w.CategoryId == categoryId.Value);
        }
    
        var weapons = await query
            .Select(w => new WeaponDto
            {
                WeaponId = w.WeaponId,
                WeaponName = w.WeaponName,
                CategoryId = w.CategoryId,
                Credits = w.Credits,
                WallPenetration = w.WallPenetration,
                WeaponImage = w.WeaponImage,
                WeaponDescription = w.WeaponDescription,
                FireMode = w.FireMode,
                FireRate = w.FireRate,
                RunSpeed = w.RunSpeed,
                EquipSpeed = w.EquipSpeed,
                ReloadSpeed = w.ReloadSpeed,
                MagazineSize = w.MagazineSize,
                ReserveAmmo = w.ReserveAmmo,
                FirstShotSpread = w.FirstShotSpread,
                DamageHeadClose = w.DamageHeadClose,
                DamageBodyClose = w.DamageBodyClose,
                DamageLegClose = w.DamageLegClose,
                DamageHeadFar = w.DamageHeadFar,
                DamageBodyFar = w.DamageBodyFar,
                DamageLegFar = w.DamageLegFar,
                Category = new WeaponCategoryDto
                {
                    CategoryId = w.Category.CategoryId,
                    CategoryName = w.Category.CategoryName
                }
            })
            .ToListAsync();

        return ApiResponse<List<WeaponDto>>.SuccessResponse(weapons);
    }

    public async Task<ApiResponse<WeaponDto>> GetWeaponByIdAsync(int weaponId)
    {
        var weapon = await _context.Weapons
            .Include(w => w.Category)
            .FirstOrDefaultAsync(w => w.WeaponId == weaponId);
        
        if (weapon == null)
        {
            return ApiResponse<WeaponDto>.ErrorResponse("Arma não encontrada");
        }

        return ApiResponse<WeaponDto>.SuccessResponse(new WeaponDto
        {
            WeaponId = weapon.WeaponId,
            WeaponName = weapon.WeaponName,
            CategoryId = weapon.CategoryId,
            Credits = weapon.Credits,
            WallPenetration = weapon.WallPenetration,
            WeaponImage = weapon.WeaponImage,
            WeaponDescription = weapon.WeaponDescription,
            FireMode = weapon.FireMode,
            FireRate = weapon.FireRate,
            RunSpeed = weapon.RunSpeed,
            EquipSpeed = weapon.EquipSpeed,
            ReloadSpeed = weapon.ReloadSpeed,
            MagazineSize = weapon.MagazineSize,
            ReserveAmmo = weapon.ReserveAmmo,
            FirstShotSpread = weapon.FirstShotSpread,
            DamageHeadClose = weapon.DamageHeadClose,
            DamageBodyClose = weapon.DamageBodyClose,
            DamageLegClose = weapon.DamageLegClose,
            DamageHeadFar = weapon.DamageHeadFar,
            DamageBodyFar = weapon.DamageBodyFar,
            DamageLegFar = weapon.DamageLegFar,
            Category = new WeaponCategoryDto
            {
                CategoryId = weapon.Category.CategoryId,
                CategoryName = weapon.Category.CategoryName
            }
        });
    }

    public async Task<ApiResponse<WeaponDto>> CreateWeaponAsync(WeaponCreateDto weaponDto)
    {
        var categoryExists = await _context.WeaponCategories.AnyAsync(c => c.CategoryId == weaponDto.CategoryId);
        if (!categoryExists)
        {
            return ApiResponse<WeaponDto>.ErrorResponse("Categoria de arma não encontrada");
        }

        var weapon = new Weapon
        {
            WeaponName = weaponDto.WeaponName,
            CategoryId = weaponDto.CategoryId,
            Credits = weaponDto.Credits,
            WallPenetration = weaponDto.WallPenetration,
            WeaponImage = weaponDto.WeaponImage,
            WeaponDescription = weaponDto.WeaponDescription,
            FireMode = weaponDto.FireMode,
            FireRate = weaponDto.FireRate,
            RunSpeed = weaponDto.RunSpeed,
            EquipSpeed = weaponDto.EquipSpeed,
            ReloadSpeed = weaponDto.ReloadSpeed,
            MagazineSize = weaponDto.MagazineSize,
            ReserveAmmo = weaponDto.ReserveAmmo,
            FirstShotSpread = weaponDto.FirstShotSpread,
            DamageHeadClose = weaponDto.DamageHeadClose,
            DamageBodyClose = weaponDto.DamageBodyClose,
            DamageLegClose = weaponDto.DamageLegClose,
            DamageHeadFar = weaponDto.DamageHeadFar,
            DamageBodyFar = weaponDto.DamageBodyFar,
            DamageLegFar = weaponDto.DamageLegFar,
        };

        _context.Weapons.Add(weapon);
        await _context.SaveChangesAsync();

        var category = await _context.WeaponCategories.FindAsync(weapon.CategoryId);

        return ApiResponse<WeaponDto>.SuccessResponse(new WeaponDto
        {
            WeaponId = weapon.WeaponId,
            WeaponName = weapon.WeaponName,
            CategoryId = weapon.CategoryId,
            Credits = weapon.Credits,
            WallPenetration = weapon.WallPenetration,
            WeaponImage = weapon.WeaponImage,
            WeaponDescription = weapon.WeaponDescription,
            FireMode = weapon.FireMode,
            FireRate = weapon.FireRate,
            RunSpeed = weapon.RunSpeed,
            EquipSpeed = weapon.EquipSpeed,
            ReloadSpeed = weapon.ReloadSpeed,
            MagazineSize = weapon.MagazineSize,
            ReserveAmmo = weapon.ReserveAmmo,
            FirstShotSpread = weapon.FirstShotSpread,
            DamageHeadClose = weapon.DamageHeadClose,
            DamageBodyClose = weapon.DamageBodyClose,
            DamageLegClose = weapon.DamageLegClose,
            DamageHeadFar = weapon.DamageHeadFar,
            DamageBodyFar = weapon.DamageBodyFar,
            DamageLegFar = weapon.DamageLegFar,
            Category = category != null ? new WeaponCategoryDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName
            } : null
        }, "Arma criada com sucesso");
    }

    public async Task<ApiResponse<WeaponDto>> UpdateWeaponAsync(int weaponId, WeaponUpdateDto weaponDto)
    {
        var weapon = await _context.Weapons.FindAsync(weaponId);
        
        if (weapon == null)
        {
            return ApiResponse<WeaponDto>.ErrorResponse("Arma não encontrada");
        }

        var categoryExists = await _context.WeaponCategories.AnyAsync(c => c.CategoryId == weaponDto.CategoryId);
        if (!categoryExists)
        {
            return ApiResponse<WeaponDto>.ErrorResponse("Categoria de arma não encontrada");
        }

        weapon.WeaponName = weaponDto.WeaponName;
        weapon.CategoryId = weaponDto.CategoryId;
        weapon.Credits = weaponDto.Credits;
        weapon.WallPenetration = weaponDto.WallPenetration;
        weapon.WeaponImage = weaponDto.WeaponImage;
        weapon.WeaponDescription = weaponDto.WeaponDescription;
        weapon.FireMode = weaponDto.FireMode;
        weapon.FireRate = weaponDto.FireRate;
        weapon.RunSpeed = weaponDto.RunSpeed;
        weapon.EquipSpeed = weaponDto.EquipSpeed;
        weapon.ReloadSpeed = weaponDto.ReloadSpeed;
        weapon.MagazineSize = weaponDto.MagazineSize;
        weapon.ReserveAmmo = weaponDto.ReserveAmmo;
        weapon.FirstShotSpread = weaponDto.FirstShotSpread;
        weapon.DamageHeadClose = weaponDto.DamageHeadClose;
        weapon.DamageBodyClose = weaponDto.DamageBodyClose;
        weapon.DamageLegClose = weaponDto.DamageLegClose;
        weapon.DamageHeadFar = weaponDto.DamageHeadFar;
        weapon.DamageBodyFar = weaponDto.DamageBodyFar;
        weapon.DamageLegFar = weaponDto.DamageLegFar;

        await _context.SaveChangesAsync();

        var category = await _context.WeaponCategories.FindAsync(weapon.CategoryId);

        return ApiResponse<WeaponDto>.SuccessResponse(new WeaponDto
        {
            WeaponId = weapon.WeaponId,
            WeaponName = weapon.WeaponName,
            CategoryId = weapon.CategoryId,
            Credits = weapon.Credits,
            WallPenetration = weapon.WallPenetration,
            WeaponImage = weapon.WeaponImage,
            WeaponDescription = weapon.WeaponDescription,
            FireMode = weapon.FireMode,
            FireRate = weapon.FireRate,
            RunSpeed = weapon.RunSpeed,
            EquipSpeed = weapon.EquipSpeed,
            ReloadSpeed = weapon.ReloadSpeed,
            MagazineSize = weapon.MagazineSize,
            ReserveAmmo = weapon.ReserveAmmo,
            FirstShotSpread = weapon.FirstShotSpread,
            DamageHeadClose = weapon.DamageHeadClose,
            DamageBodyClose = weapon.DamageBodyClose,
            DamageLegClose = weapon.DamageLegClose,
            DamageHeadFar = weapon.DamageHeadFar,
            DamageBodyFar = weapon.DamageBodyFar,
            DamageLegFar = weapon.DamageLegFar,
            Category = category != null ? new WeaponCategoryDto
            {
                CategoryId = category.CategoryId,
                CategoryName = category.CategoryName
            } : null
        }, "Arma atualizada com sucesso");
    }

    public async Task<ApiResponse<bool>> DeleteWeaponAsync(int weaponId)
    {
        var weapon = await _context.Weapons.FindAsync(weaponId);
        
        if (weapon == null)
        {
            return ApiResponse<bool>.ErrorResponse("Arma não encontrada");
        }

        _context.Weapons.Remove(weapon);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Arma excluída com sucesso");
    }

    public async Task<ApiResponse<List<WeaponCategoryDto>>> GetAllWeaponCategoriesAsync()
    {
        var categories = await _context.WeaponCategories
            .Select(c => new WeaponCategoryDto
            {
                CategoryId = c.CategoryId,
                CategoryName = c.CategoryName
            })
            .ToListAsync();

        return ApiResponse<List<WeaponCategoryDto>>.SuccessResponse(categories);
    }
}