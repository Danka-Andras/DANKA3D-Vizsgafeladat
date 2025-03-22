using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.DataContext;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;

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

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var existingUser = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (existingUser != null)
            {
                return BadRequest("User already exists.");
            }

            var hashedPassword = HashPassword(request.Password);

            var user = new UserModel
            {
                Email = request.Email,
                PasswordHash = hashedPassword,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            // Kosár létrehozása ugyanazzal az id-vel, mint a felhasználó
            var cart = new CartModel
            {
                Id = user.Id, // Azonos ID a felhasználóval
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow
            };

            _context.Carts.Add(cart);
            _context.SaveChanges();

            return Ok(new { message = "User registered successfully and cart created!" });
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials.");
            }

            HttpContext.Session.SetString("UserEmail", user.Email);

            return Ok(new { message = "Login successful!" });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            HttpContext.Session.Remove("UserEmail");
            return Ok(new { message = "Logout successful!" });
        }

        [HttpGet("me")]
        public IActionResult GetCurrentUser()
        {
            var userEmail = HttpContext.Session.GetString("UserEmail");
            if (string.IsNullOrEmpty(userEmail))
            {
                return Unauthorized("No active session.");
            }

            var user = _context.Users.FirstOrDefault(u => u.Email == userEmail);
            if (user == null)
            {
                return Unauthorized("User not found.");
            }

            return Ok(new { userId = user.Id, email = user.Email });
        }


        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(bytes);
            }
        }

        private bool VerifyPassword(string enteredPassword, string storedHash)
        {
            var enteredHash = HashPassword(enteredPassword);
            return enteredHash == storedHash;
        }

        public class RegisterRequest
        {
            public string? Email { get; set; }
            public string? Password { get; set; }
        }

        public class LoginRequest
        {
            public string? Email { get; set; }
            public string? Password { get; set; }
        }
    }
}