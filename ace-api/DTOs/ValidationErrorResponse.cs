namespace ace_api.DTOs;

public class ValidationErrorResponse
{
    public bool Success { get; set; } = false;
    public string Message { get; set; } = "Erro de validação";
    public IDictionary<string, string[]> Errors { get; set; } = null!;
}