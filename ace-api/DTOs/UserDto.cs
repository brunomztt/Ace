namespace ace_api.DTOs;

public class UserDto
{
    public int UserId { get; set; }
    public string FullName { get; set; } = null!;
    public string Nickname { get; set; } = null!;
    public string Cpf { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public bool IsEnabled { get; set; }
    public RoleDto? Role { get; set; }
    public AddressDto? Address { get; set; }
}