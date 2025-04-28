namespace ace_api.DTOs;

public class UserRegistrationDto
{
    public string FirstName { get; set; } = null!;
    public string? LastName { get; set; } = null!;
    public string Nickname { get; set; } = null!;
    public string Cpf { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? ProfilePic { get; set; }
    public string? BannerImg { get; set; }
    public AddressDto? Address { get; set; }
}