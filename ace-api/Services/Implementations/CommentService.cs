using ace_api.Data;
using ace_api.DTOs;
using ace_api.Models;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ace_api.Services.Implementations;

public class CommentService : ICommentService
{
    private readonly AceDbContext _context;

    public CommentService(AceDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CommentDto>>> GetCommentsByEntityAsync(string entityType, int entityId)
    {
        var entityExists = false;

        switch (entityType)
        {
            case "Guide":
                entityExists = await _context.Guides.AnyAsync(g => g.GuideId == entityId);
                break;
            case "Weapon":
                entityExists = await _context.Weapons.AnyAsync(w => w.WeaponId == entityId);
                break;
            case "Map":
                entityExists = await _context.Maps.AnyAsync(m => m.MapId == entityId);
                break;
            case "Agent":
                entityExists = await _context.Agents.AnyAsync(a => a.AgentId == entityId);
                break;
            default:
                return ApiResponse<List<CommentDto>>.ErrorResponse("Tipo de entidade inválido");
        }

        if (!entityExists)
        {
            return ApiResponse<List<CommentDto>>.ErrorResponse($"{entityType} não encontrado");
        }

        var comments = await _context.Comments
            .Include(c => c.User)
            .Where(c => c.EntityType == entityType && c.EntityId == entityId)
            .OrderByDescending(c => c.CommentDate)
            .Select(c => new CommentDto
            {
                CommentId = c.CommentId,
                EntityType = c.EntityType,
                EntityId = c.EntityId,
                CommentText = c.CommentText,
                CommentDate = c.CommentDate,
                Author = c.User != null
                    ? new UserSummaryDto
                    {
                        UserId = c.User.UserId,
                        Nickname = c.User.Nickname
                    }
                    : null
            })
            .ToListAsync();

        return ApiResponse<List<CommentDto>>.SuccessResponse(comments);
    }

    public async Task<ApiResponse<CommentDto>> AddCommentAsync(int userId, CommentCreateDto commentDto)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return ApiResponse<CommentDto>.ErrorResponse("Usuário não encontrado");
        }

        // Inserção SQL direta para evitar problemas com o Entity Framework
        var commentDate = DateTime.UtcNow;
        var commentId = 0;

        await using (var command = _context.Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = "INSERT INTO comment (entity_type, entity_id, user_id, comment_text, comment_date) " +
                                  "VALUES (@entityType, @entityId, @userId, @commentText, @commentDate); " +
                                  "SELECT LAST_INSERT_ID();";

            var entityTypeParam = command.CreateParameter();\
            entityTypeParam.ParameterName = "@entityType";
            entityTypeParam.Value = commentDto.EntityType;
            command.Parameters.Add(entityTypeParam);

            var entityIdParam = command.CreateParameter();
            entityIdParam.ParameterName = "@entityId";
            entityIdParam.Value = commentDto.EntityId;
            command.Parameters.Add(entityIdParam);

            var userIdParam = command.CreateParameter();
            userIdParam.ParameterName = "@userId";
            userIdParam.Value = userId;
            command.Parameters.Add(userIdParam);

            var commentTextParam = command.CreateParameter();
            commentTextParam.ParameterName = "@commentText";
            commentTextParam.Value = commentDto.CommentText;
            command.Parameters.Add(commentTextParam);

            var commentDateParam = command.CreateParameter();
            commentDateParam.ParameterName = "@commentDate";
            commentDateParam.Value = commentDate;
            command.Parameters.Add(commentDateParam);

            await _context.Database.OpenConnectionAsync();
            try
            {
                var result = await command.ExecuteScalarAsync();
                commentId = Convert.ToInt32(result);
            }
            finally
            {
                await _context.Database.CloseConnectionAsync();
            }
        }

        return ApiResponse<CommentDto>.SuccessResponse(new CommentDto
        {
            CommentId = commentId,
            EntityType = commentDto.EntityType,
            EntityId = commentDto.EntityId,
            CommentText = commentDto.CommentText,
            CommentDate = commentDate,
            Author = new UserSummaryDto
            {
                UserId = user.UserId,
                Nickname = user.Nickname
            }
        }, "Comentário adicionado com sucesso");
    }

    public async Task<ApiResponse<bool>> DeleteCommentAsync(int commentId, int userId)
    {
        var comment = await _context.Comments.FindAsync(commentId);
        if (comment == null)
        {
            return ApiResponse<bool>.ErrorResponse("Comentário não encontrado");
        }

        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (comment.UserId != userId && (user?.Role?.RoleName != "Admin" && user?.Role?.RoleName != "Moderator"))
        {
            return ApiResponse<bool>.ErrorResponse("Você não tem permissão para excluir este comentário");
        }

        _context.Comments.Remove(comment);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Comentário excluído com sucesso");
    }
}