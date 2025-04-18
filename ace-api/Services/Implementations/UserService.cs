using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ace_api.Data;
using ace_api.DTOs;
using ace_api.Models;
using ace_api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ace_api.Services.Implementations;

public class UserService : IUserService
{
    private readonly AceDbContext _context;
    private readonly IConfiguration _configuration;

    public UserService(AceDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<ApiResponse<UserDto>> RegisterUserAsync(UserRegistrationDto registrationDto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == registrationDto.Email))
        {
            return ApiResponse<UserDto>.ErrorResponse("Este email já está em uso");
        }

        if (await _context.Users.AnyAsync(u => u.Nickname == registrationDto.Nickname))
        {
            return ApiResponse<UserDto>.ErrorResponse("Este nome de usuário já está em uso");
        }

        if (await _context.Users.AnyAsync(u => u.Cpf == registrationDto.Cpf))
        {
            return ApiResponse<UserDto>.ErrorResponse("Este CPF já está cadastrado");
        }

        Address? address = null;
        if (registrationDto.Address != null)
        {
            address = new Address
            {
                Street = registrationDto.Address.Street,
                District = registrationDto.Address.District,
                ZipCode = registrationDto.Address.ZipCode,
                HouseNumber = registrationDto.Address.HouseNumber,
                Complement = registrationDto.Address.Complement
            };
            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();
        }

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(registrationDto.Password);

        var user = new User
        {
            FullName = registrationDto.FullName,
            Nickname = registrationDto.Nickname,
            Cpf = registrationDto.Cpf,
            PhoneNumber = registrationDto.PhoneNumber,
            Email = registrationDto.Email,
            Password = hashedPassword,
            RoleId = 3, // Default role 'User'
            AddressId = address?.AddressId
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return ApiResponse<UserDto>.SuccessResponse(new UserDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            Nickname = user.Nickname,
            Cpf = user.Cpf,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            IsEnabled = user.IsEnabled,
            Role = new RoleDto { RoleId = 3, RoleName = "User" },
            Address = address != null
                ? new AddressDto
                {
                    Street = address.Street,
                    District = address.District,
                    ZipCode = address.ZipCode,
                    HouseNumber = address.HouseNumber,
                    Complement = address.Complement
                }
                : null
        }, "Usuário cadastrado com sucesso");
    }

    public async Task<ApiResponse<LoginResponseDto>> LoginAsync(UserLoginDto loginDto)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.Nickname == loginDto.Nickname);

        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password))
        {
            return ApiResponse<LoginResponseDto>.ErrorResponse("Nome de usuário ou senha inválidos");
        }

        if (!user.IsEnabled)
        {
            return ApiResponse<LoginResponseDto>.ErrorResponse("Esta conta está desativada");
        }

        var token = GenerateJwtToken(user);

        return ApiResponse<LoginResponseDto>.SuccessResponse(new LoginResponseDto
        {
            UserId = user.UserId,
            Nickname = user.Nickname,
            FullName = user.FullName,
            Email = user.Email,
            RoleName = user.Role?.RoleName ?? "User",
            Token = token
        }, "Login realizado com sucesso");
    }

    public async Task<ApiResponse<UserDto>> GetUserByIdAsync(int userId)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Address)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            return ApiResponse<UserDto>.ErrorResponse("Usuário não encontrado");
        }

        return ApiResponse<UserDto>.SuccessResponse(new UserDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            Nickname = user.Nickname,
            Cpf = user.Cpf,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            IsEnabled = user.IsEnabled,
            Role = user.Role != null
                ? new RoleDto
                {
                    RoleId = user.Role.RoleId,
                    RoleName = user.Role.RoleName
                }
                : null,
            Address = user.Address != null
                ? new AddressDto
                {
                    Street = user.Address.Street,
                    District = user.Address.District,
                    ZipCode = user.Address.ZipCode,
                    HouseNumber = user.Address.HouseNumber,
                    Complement = user.Address.Complement
                }
                : null
        });
    }

    public async Task<ApiResponse<List<UserDto>>> GetAllUsersAsync()
    {
        var users = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Address)
            .Select(u => new UserDto
            {
                UserId = u.UserId,
                FullName = u.FullName,
                Nickname = u.Nickname,
                Cpf = u.Cpf,
                Email = u.Email,
                PhoneNumber = u.PhoneNumber,
                IsEnabled = u.IsEnabled,
                Role = u.Role != null
                    ? new RoleDto
                    {
                        RoleId = u.Role.RoleId,
                        RoleName = u.Role.RoleName
                    }
                    : null,
                Address = u.Address != null
                    ? new AddressDto
                    {
                        Street = u.Address.Street,
                        District = u.Address.District,
                        ZipCode = u.Address.ZipCode,
                        HouseNumber = u.Address.HouseNumber,
                        Complement = u.Address.Complement
                    }
                    : null
            })
            .ToListAsync();

        return ApiResponse<List<UserDto>>.SuccessResponse(users);
    }

    public async Task<ApiResponse<UserDto>> UpdateUserAsync(int userId, UserUpdateDto updateDto)
    {
        var user = await _context.Users
            .Include(u => u.Address)
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserId == userId);

        if (user == null)
        {
            return ApiResponse<UserDto>.ErrorResponse("Usuário não encontrado");
        }

        if (!string.IsNullOrEmpty(updateDto.Email) && updateDto.Email != user.Email)
        {
            if (await _context.Users.AnyAsync(u => u.Email == updateDto.Email && u.UserId != userId))
            {
                return ApiResponse<UserDto>.ErrorResponse("Este email já está em uso");
            }

            user.Email = updateDto.Email;
        }

        if (!string.IsNullOrEmpty(updateDto.FullName))
        {
            user.FullName = updateDto.FullName;
        }

        if (!string.IsNullOrEmpty(updateDto.PhoneNumber))
        {
            user.PhoneNumber = updateDto.PhoneNumber;
        }

        if (!string.IsNullOrEmpty(updateDto.Password))
        {
            user.Password = BCrypt.Net.BCrypt.HashPassword(updateDto.Password);
        }

        if (updateDto.Address != null)
        {
            if (user.Address == null)
            {
                var address = new Address
                {
                    Street = updateDto.Address.Street,
                    District = updateDto.Address.District,
                    ZipCode = updateDto.Address.ZipCode,
                    HouseNumber = updateDto.Address.HouseNumber,
                    Complement = updateDto.Address.Complement
                };
                _context.Addresses.Add(address);
                await _context.SaveChangesAsync();
                user.AddressId = address.AddressId;
                user.Address = address;
            }
            else
            {
                user.Address.Street = updateDto.Address.Street;
                user.Address.District = updateDto.Address.District;
                user.Address.ZipCode = updateDto.Address.ZipCode;
                user.Address.HouseNumber = updateDto.Address.HouseNumber;
                user.Address.Complement = updateDto.Address.Complement;
            }
        }

        await _context.SaveChangesAsync();

        return ApiResponse<UserDto>.SuccessResponse(new UserDto
        {
            UserId = user.UserId,
            FullName = user.FullName,
            Nickname = user.Nickname,
            Cpf = user.Cpf,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            IsEnabled = user.IsEnabled,
            Role = user.Role != null
                ? new RoleDto
                {
                    RoleId = user.Role.RoleId,
                    RoleName = user.Role.RoleName
                }
                : null,
            Address = user.Address != null
                ? new AddressDto
                {
                    Street = user.Address.Street,
                    District = user.Address.District,
                    ZipCode = user.Address.ZipCode,
                    HouseNumber = user.Address.HouseNumber,
                    Complement = user.Address.Complement
                }
                : null
        }, "Usuário atualizado com sucesso");
    }

    public async Task<ApiResponse<bool>> DeleteUserAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null)
        {
            return ApiResponse<bool>.ErrorResponse("Usuário não encontrado");
        }

        user.IsEnabled = false;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResponse(true, "Usuário desativado com sucesso");
    }

    private string GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "teste123");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.UserId.ToString())
        };

        if (user.Role != null)
        {
            claims.Add(new Claim(ClaimTypes.Role, user.Role.RoleName));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(365),
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"]
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}