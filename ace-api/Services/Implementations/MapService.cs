using ace_api.Data;
using ace_api.DTOs;
using ace_api.Models;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Services.Implementations;

public class MapService : IMapService
{
    private readonly AceDbContext _context;

    public MapService(AceDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<MapDto>>> GetAllMapsAsync(string? searchTerm = null)
    {
        IQueryable<Map> query = _context.Maps;
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(m => m.MapName.Contains(searchTerm));
        }
    
        var maps = await query
            .Select(m => new MapDto
            {
                MapId = m.MapId,
                MapName = m.MapName,
                MapDescription = m.MapDescription,
                MapImage = m.MapImage
            })
            .ToListAsync();

        return ApiResponse<List<MapDto>>.SuccessResponse(maps);
    }

    public async Task<ApiResponse<MapDto>> GetMapByIdAsync(int mapId)
    {
        var map = await _context.Maps.FindAsync(mapId);
        
        if (map == null)
        {
            return ApiResponse<MapDto>.ErrorResponse("Mapa não encontrado");
        }

        return ApiResponse<MapDto>.SuccessResponse(new MapDto
        {
            MapId = map.MapId,
            MapName = map.MapName,
            MapDescription = map.MapDescription,
            MapImage = map.MapImage
        });
    }

    public async Task<ApiResponse<MapDto>> CreateMapAsync(MapCreateDto mapDto)
    {
        var map = new Map
        {
            MapName = mapDto.MapName,
            MapDescription = mapDto.MapDescription,
            MapImage = mapDto.MapImage
        };

        _context.Maps.Add(map);
        await _context.SaveChangesAsync();

        return ApiResponse<MapDto>.SuccessResponse(new MapDto
        {
            MapId = map.MapId,
            MapName = map.MapName,
            MapDescription = map.MapDescription,
            MapImage = map.MapImage
        }, "Mapa criado com sucesso");
    }

    public async Task<ApiResponse<MapDto>> UpdateMapAsync(int mapId, MapUpdateDto mapDto)
    {
        var map = await _context.Maps.FindAsync(mapId);
        
        if (map == null)
        {
            return ApiResponse<MapDto>.ErrorResponse("Mapa não encontrado");
        }

        map.MapName = mapDto.MapName;
        map.MapDescription = mapDto.MapDescription;
        map.MapImage = mapDto.MapImage;

        await _context.SaveChangesAsync();

        return ApiResponse<MapDto>.SuccessResponse(new MapDto
        {
            MapId = map.MapId,
            MapName = map.MapName,
            MapDescription = map.MapDescription,
            MapImage = map.MapImage
        }, "Mapa atualizado com sucesso");
    }

    public async Task<ApiResponse<bool>> DeleteMapAsync(int mapId)
    {
        var map = await _context.Maps.FindAsync(mapId);
        
        if (map == null)
        {
            return ApiResponse<bool>.ErrorResponse("Mapa não encontrado");
        }

        _context.Maps.Remove(map);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Mapa excluído com sucesso");
    }
}