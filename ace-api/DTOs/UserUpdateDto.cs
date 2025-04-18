namespace ace_api.DTOs;

public class UserUpdateDto
{
    public string? FullName { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public AddressDto? Address { get; set; }
}