public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly JwtTokenGenerator _tokenGenerator;

    public AuthService(AppDbContext context, JwtTokenGenerator tokenGenerator)
    {
        _context = context;
        _tokenGenerator = tokenGenerator;
    }

    public string Authenticate(LoginDto loginDto)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username == loginDto.Username);
        if (user == null || user.PasswordHash != loginDto.Password) // Replace with hashing in real apps
            throw new UnauthorizedAccessException("Invalid credentials");

        return _tokenGenerator.GenerateToken(user);
    }
}

