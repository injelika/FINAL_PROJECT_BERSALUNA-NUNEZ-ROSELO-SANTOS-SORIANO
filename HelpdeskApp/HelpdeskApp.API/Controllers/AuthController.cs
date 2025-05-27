[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDto dto)
    {
        try
        {
            var token = _authService.Authenticate(dto);
            return Ok(new { token });
        }
        catch
        {
            return Unauthorized("Invalid username or password.");
        }
    }
}

