namespace ace_api.DTOs;

public class AddressDto
{
    public string Street { get; set; } = null!;
    public string District { get; set; } = null!;
    public string ZipCode { get; set; } = null!;
    public string HouseNumber { get; set; } = null!;
    public string? Complement { get; set; }
}
