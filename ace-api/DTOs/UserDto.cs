namespace ace_api.DTOs;

public class UserDto
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Nickname { get; set; } = null!;
    public string Cpf { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string? ProfilePic { get; set; }
    public string? BannerImg { get; set; }
    public string password { get; set; } = null!;
    public bool IsEnabled { get; set; }
    public RoleDto? Role { get; set; }
    public AddressDto? Address { get; set; }
}