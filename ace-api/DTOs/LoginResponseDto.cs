namespace ace_api.DTOs;

public class LoginResponseDto
{
    public int UserId { get; set; }
    public string Nickname { get; set; } = null!;
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? ProfilePic { get; set; }
    public string RoleName { get; set; } = null!;
    public string Token { get; set; } = null!;
}