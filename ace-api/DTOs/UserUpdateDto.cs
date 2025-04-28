namespace ace_api.DTOs;

public class UserUpdateDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Password { get; set; }
    public string? ProfilePic { get; set; }
    public string? BannerImg { get; set; }
    public string? BirthDate { get; set; }
    public AddressDto? Address { get; set; }
}