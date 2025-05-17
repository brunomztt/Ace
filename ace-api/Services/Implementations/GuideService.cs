using ace_api.Data;
using ace_api.DTOs;
using ace_api.Models;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Services.Implementations;

public class GuideService : IGuideService
{
    private readonly AceDbContext _context;

    public GuideService(AceDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<GuideDto>>> GetAllGuidesAsync(string? searchTerm = null, string? guideType = null)
    {
        IQueryable<Guide> query = _context.Guides
            .Include(g => g.User)
            .OrderByDescending(g => g.CreatedAt);
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(g => g.Title.Contains(searchTerm));
        }
    
        if (!string.IsNullOrWhiteSpace(guideType))
        {
            query = query.Where(g => g.GuideType == guideType);
        }
    
        var guides = await query
            .Select(g => new GuideDto
            {
                GuideId = g.GuideId,
                Title = g.Title,
                Content = g.Content,
                GuideType = g.GuideType,
                CreatedAt = g.CreatedAt,
                Author = g.User != null
                    ? new UserSummaryDto
                    {
                        UserId = g.User.UserId,
                        Nickname = g.User.Nickname
                    }
                    : null
            })
            .ToListAsync();

        return ApiResponse<List<GuideDto>>.SuccessResponse(guides);
    }

    public async Task<ApiResponse<GuideDto>> GetGuideByIdAsync(int guideId)
    {
        var guide = await _context.Guides
            .Include(g => g.User)
            .Include(g => g.Comments)
            .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(g => g.GuideId == guideId);

        if (guide == null)
        {
            return ApiResponse<GuideDto>.ErrorResponse("Guia não encontrado");
        }

        return ApiResponse<GuideDto>.SuccessResponse(new GuideDto
        {
            GuideId = guide.GuideId,
            Title = guide.Title,
            Content = guide.Content,
            GuideType = guide.GuideType,
            CreatedAt = guide.CreatedAt,
            Author = guide.User != null
                ? new UserSummaryDto
                {
                    UserId = guide.User.UserId,
                    Nickname = guide.User.Nickname
                }
                : null,
            Comments = guide.Comments.Select(c => new CommentDto
            {
                CommentId = c.CommentId,
                CommentText = c.CommentText,
                CommentDate = c.CommentDate,
                Author = c.User != null
                    ? new UserSummaryDto
                    {
                        UserId = c.User.UserId,
                        Nickname = c.User.Nickname
                    }
                    : null
            }).ToList()
        });
    }

    public async Task<ApiResponse<GuideDto>> CreateGuideAsync(int userId, GuideCreateDto guideDto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return ApiResponse<GuideDto>.ErrorResponse("Usuário não encontrado");
        }

        var guide = new Guide
        {
            UserId = userId,
            Title = guideDto.Title,
            Content = guideDto.Content,
            GuideType = guideDto.GuideType,
            CreatedAt = DateTime.UtcNow
        };

        _context.Guides.Add(guide);
        await _context.SaveChangesAsync();

        return ApiResponse<GuideDto>.SuccessResponse(new GuideDto
        {
            GuideId = guide.GuideId,
            Title = guide.Title,
            Content = guide.Content,
            GuideType = guide.GuideType,
            CreatedAt = guide.CreatedAt,
            Author = new UserSummaryDto
            {
                UserId = user.UserId,
                Nickname = user.Nickname
            },
            Comments = new List<CommentDto>()
        }, "Guia criado com sucesso");
    }

    public async Task<ApiResponse<GuideDto>> UpdateGuideAsync(int guideId, int userId, GuideCreateDto guideDto)
    {
        var guide = await _context.Guides
            .Include(g => g.User)
            .FirstOrDefaultAsync(g => g.GuideId == guideId);

        if (guide == null)
        {
            return ApiResponse<GuideDto>.ErrorResponse("Guia não encontrado");
        }

        if (guide.UserId != userId)
        {
            return ApiResponse<GuideDto>.ErrorResponse("Você não tem permissão para editar este guia");
        }

        guide.Title = guideDto.Title;
        guide.Content = guideDto.Content;
        guide.GuideType = guideDto.GuideType;

        await _context.SaveChangesAsync();

        return ApiResponse<GuideDto>.SuccessResponse(new GuideDto
        {
            GuideId = guide.GuideId,
            Title = guide.Title,
            Content = guide.Content,
            GuideType = guide.GuideType,
            CreatedAt = guide.CreatedAt,
            Author = guide.User != null
                ? new UserSummaryDto
                {
                    UserId = guide.User.UserId,
                    Nickname = guide.User.Nickname
                }
                : null
        }, "Guia atualizado com sucesso");
    }

    public async Task<ApiResponse<bool>> DeleteGuideAsync(int guideId, int userId)
    {
        var guide = await _context.Guides.FindAsync(guideId);
        if (guide == null)
        {
            return ApiResponse<bool>.ErrorResponse("Guia não encontrado");
        }

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (guide.UserId != userId && (user?.Role?.RoleName != "Admin" && user?.Role?.RoleName != "Moderator"))
        {
            return ApiResponse<bool>.ErrorResponse("Você não tem permissão para excluir este guia");
        }

        _context.Guides.Remove(guide);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Guia excluído com sucesso");
    }

    public async Task<ApiResponse<CommentDto>> AddCommentAsync(int userId, CommentCreateDto commentDto)
    {
        var guide = await _context.Guides.FindAsync(commentDto.GuideId);
        if (guide == null)
        {
            return ApiResponse<CommentDto>.ErrorResponse("Guia não encontrado");
        }

        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return ApiResponse<CommentDto>.ErrorResponse("Usuário não encontrado");
        }

        var comment = new Comment
        {
            GuideId = commentDto.GuideId,
            UserId = userId,
            CommentText = commentDto.CommentText,
            CommentDate = DateTime.UtcNow
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        return ApiResponse<CommentDto>.SuccessResponse(new CommentDto
        {
            CommentId = comment.CommentId,
            CommentText = comment.CommentText,
            CommentDate = comment.CommentDate,
            Author = new UserSummaryDto
            {
                UserId = user.UserId,
                Nickname = user.Nickname
            }
        }, "Comentário adicionado com sucesso");
    }
}