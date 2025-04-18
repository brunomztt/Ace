namespace ace_api.DTOs;

public class UserRegistrationDto
{
    public string FullName { get; set; } = null!;
    public string Nickname { get; set; } = null!;
    public string Cpf { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public AddressDto? Address { get; set; }
}