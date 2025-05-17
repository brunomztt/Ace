using ace_api.Data;
using ace_api.DTOs;
using ace_api.Models;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Services.Implementations;

public class SkinService : ISkinService
{
    private readonly AceDbContext _context;

    public SkinService(AceDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<SkinDto>>> GetAllSkinsAsync(string? searchTerm = null, int? weaponId = null)
    {
        IQueryable<Skin> query = _context.Skins
            .Include(s => s.Weapon);
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(s => s.SkinName.Contains(searchTerm));
        }
    
        if (weaponId.HasValue)
        {
            query = query.Where(s => s.WeaponId == weaponId.Value);
        }
    
        var skins = await query
            .Select(s => new SkinDto
            {
                SkinId = s.SkinId,
                SkinName = s.SkinName,
                WeaponId = s.WeaponId,
                SkinImage = s.SkinImage,
                Description = s.Description,
                Weapon = s.Weapon != null ? new WeaponDto
                {
                    WeaponId = s.Weapon.WeaponId,
                    WeaponName = s.Weapon.WeaponName,
                    CategoryId = s.Weapon.CategoryId,
                    Credits = s.Weapon.Credits,
                    WallPenetration = s.Weapon.WallPenetration
                } : null
            })
            .ToListAsync();

        return ApiResponse<List<SkinDto>>.SuccessResponse(skins);
    }

    public async Task<ApiResponse<SkinDto>> GetSkinByIdAsync(int skinId)
    {
        var skin = await _context.Skins
            .Include(s => s.Weapon)
            .FirstOrDefaultAsync(s => s.SkinId == skinId);
        
        if (skin == null)
        {
            return ApiResponse<SkinDto>.ErrorResponse("Skin não encontrada");
        }

        return ApiResponse<SkinDto>.SuccessResponse(new SkinDto
        {
            SkinId = skin.SkinId,
            SkinName = skin.SkinName,
            WeaponId = skin.WeaponId,
            SkinImage = skin.SkinImage,
            Description = skin.Description,
            Weapon = skin.Weapon != null ? new WeaponDto
            {
                WeaponId = skin.Weapon.WeaponId,
                WeaponName = skin.Weapon.WeaponName,
                CategoryId = skin.Weapon.CategoryId,
                Credits = skin.Weapon.Credits,
                WallPenetration = skin.Weapon.WallPenetration
            } : null
        });
    }

    public async Task<ApiResponse<List<SkinDto>>> GetSkinsByWeaponIdAsync(int weaponId)
    {
        var weaponExists = await _context.Weapons.AnyAsync(w => w.WeaponId == weaponId);
        if (!weaponExists)
        {
            return ApiResponse<List<SkinDto>>.ErrorResponse("Arma não encontrada");
        }

        var skins = await _context.Skins
            .Include(s => s.Weapon)
            .Where(s => s.WeaponId == weaponId)
            .Select(s => new SkinDto
            {
                SkinId = s.SkinId,
                SkinName = s.SkinName,
                WeaponId = s.WeaponId,
                SkinImage = s.SkinImage,
                Description = s.Description,
                Weapon = s.Weapon != null ? new WeaponDto
                {
                    WeaponId = s.Weapon.WeaponId,
                    WeaponName = s.Weapon.WeaponName,
                    CategoryId = s.Weapon.CategoryId,
                    Credits = s.Weapon.Credits,
                    WallPenetration = s.Weapon.WallPenetration
                } : null
            })
            .ToListAsync();

        return ApiResponse<List<SkinDto>>.SuccessResponse(skins);
    }

    public async Task<ApiResponse<SkinDto>> CreateSkinAsync(SkinCreateDto skinDto)
    {
        var weaponExists = await _context.Weapons.AnyAsync(w => w.WeaponId == skinDto.WeaponId);
        if (!weaponExists)
        {
            return ApiResponse<SkinDto>.ErrorResponse("Arma não encontrada");
        }

        var skin = new Skin
        {
            SkinName = skinDto.SkinName,
            WeaponId = skinDto.WeaponId,
            SkinImage = skinDto.SkinImage,
            Description = skinDto.Description
        };

        _context.Skins.Add(skin);
        await _context.SaveChangesAsync();

        var weapon = await _context.Weapons.FindAsync(skin.WeaponId);

        return ApiResponse<SkinDto>.SuccessResponse(new SkinDto
        {
            SkinId = skin.SkinId,
            SkinName = skin.SkinName,
            WeaponId = skin.WeaponId,
            SkinImage = skin.SkinImage,
            Description = skin.Description,
            Weapon = weapon != null ? new WeaponDto
            {
                WeaponId = weapon.WeaponId,
                WeaponName = weapon.WeaponName,
                CategoryId = weapon.CategoryId,
                Credits = weapon.Credits,
                WallPenetration = weapon.WallPenetration
            } : null
        }, "Skin criada com sucesso");
    }

    public async Task<ApiResponse<SkinDto>> UpdateSkinAsync(int skinId, SkinUpdateDto skinDto)
    {
        var skin = await _context.Skins.FindAsync(skinId);
        if (skin == null)
        {
            return ApiResponse<SkinDto>.ErrorResponse("Skin não encontrada");
        }

        var weaponExists = await _context.Weapons.AnyAsync(w => w.WeaponId == skinDto.WeaponId);
        if (!weaponExists)
        {
            return ApiResponse<SkinDto>.ErrorResponse("Arma não encontrada");
        }

        skin.SkinName = skinDto.SkinName;
        skin.WeaponId = skinDto.WeaponId;
        skin.SkinImage = skinDto.SkinImage;
        skin.Description = skinDto.Description;

        await _context.SaveChangesAsync();

        var weapon = await _context.Weapons.FindAsync(skin.WeaponId);

        return ApiResponse<SkinDto>.SuccessResponse(new SkinDto
        {
            SkinId = skin.SkinId,
            SkinName = skin.SkinName,
            WeaponId = skin.WeaponId,
            SkinImage = skin.SkinImage,
            Description = skin.Description,
            Weapon = weapon != null ? new WeaponDto
            {
                WeaponId = weapon.WeaponId,
                WeaponName = weapon.WeaponName,
                CategoryId = weapon.CategoryId,
                Credits = weapon.Credits,
                WallPenetration = weapon.WallPenetration
            } : null
        }, "Skin atualizada com sucesso");
    }

    public async Task<ApiResponse<bool>> DeleteSkinAsync(int skinId)
    {
        var skin = await _context.Skins.FindAsync(skinId);
        
        if (skin == null)
        {
            return ApiResponse<bool>.ErrorResponse("Skin não encontrada");
        }

        _context.Skins.Remove(skin);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Skin excluída com sucesso");
    }
}