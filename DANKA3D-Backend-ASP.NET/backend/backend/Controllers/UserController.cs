using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.DataContext;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly DatabaseContext _context;

        public UserController(DatabaseContext context)
        {
            _context = context;
        }

        // Regisztráció végpont
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return BadRequest("User already exists.");
            }

            var hashedPassword = HashPassword(request.Password); // SHA-256 hash

            var user = new UserModel
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully!" });
        }

        // Bejelentkezés végpont
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash)) // Verify password
            {
                return Unauthorized("Invalid credentials.");
            }

            return Ok(new { message = "Login successful!" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            return Ok(new { message = "Logout successful!" });
        }

        // Jelszó hashelése SHA-256 algoritmussal
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        // Jelszó ellenőrzése
        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            var enteredHash = HashPassword(enteredPassword);
            return enteredHash == storedHash;
        }

        // Regisztrációs kérés modell
        public class RegisterRequest
        {
            public string? Email { get; set; }
            public string? Password { get; set; }
        }

        // Bejelentkezési kérés modell
        public class LoginRequest
        {
            public string? Email { get; set; }
            public string? Password { get; set; }
        }
    }
}
