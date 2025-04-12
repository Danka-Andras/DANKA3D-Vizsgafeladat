using Microsoft.EntityFrameworkCore; // Fontos direktíva!
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using backend.Models;
using backend.DataContext;
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class CartController : ControllerBase
{
    private readonly DatabaseContext _context;

    public CartController(DatabaseContext context)
    {
        _context = context;
    }

    // Get the current user's cart
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetCart(int userId)
    {
        try
        {
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null)
            {
                // If no cart exists, create a new cart
                cart = new CartModel { UserId = userId, CreatedAt = DateTime.UtcNow };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            // Serialize the response with ReferenceHandler.Preserve to handle cyclic references
            var options = new JsonSerializerOptions
            {
                ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve
            };

            var serializedCart = JsonSerializer.Serialize(cart, options);
            return Ok(serializedCart);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching cart for user ID {userId}: {ex.Message}");
            return StatusCode(500, "An error occurred while fetching the cart.");
        }
    }

    // Add item to the cart
    [HttpPost("add-item")]
    public async Task<IActionResult> AddItemToCart([FromBody] AddToCartRequest request)
    {
        if (request.UserId <= 0 || request.ProductId <= 0 || request.Quantity <= 0)
        {
            return BadRequest("Érvénytelen adatokat küldtél.");
        }

        try
        {
            // Check if the product exists in the database
            var product = await _context.Products.FindAsync(request.ProductId);
            if (product == null)
            {
                return BadRequest("A megadott termék nem létezik.");
            }

            // Fetch the user's cart
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == request.UserId);

            // If cart does not exist, create a new cart for the user
            if (cart == null)
            {
                cart = new CartModel { UserId = request.UserId, CreatedAt = DateTime.UtcNow };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync(); // Save the new cart to the database
            }

            // Check if the item already exists in the cart
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == request.ProductId);
            if (cartItem != null)
            {
                // If item exists, update the quantity
                cartItem.Quantity += request.Quantity;
            }
            else
            {
                // Otherwise, add a new item to the cart
                cart.CartItems.Add(new CartItemModel
                {
                    CartId = cart.Id,
                    ProductId = request.ProductId,
                    Quantity = request.Quantity
                });
            }

            // Save the changes to the database
            await _context.SaveChangesAsync();
            return Ok(new { message = "Termék sikeresen hozzáadva a kosárhoz!" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hiba történt: {ex.Message}");
            return StatusCode(500, $"Hiba történt a kosár frissítése során: {ex.Message}");
        }
    }

    // Update item quantity in the cart
    [HttpPut("update-item/{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromQuery] int quantity)
    {
        if (quantity <= 0)
        {
            return BadRequest(new { message = "Quantity must be greater than zero." });
        }

        try
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            cartItem.Quantity = quantity;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item updated." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error updating cart item: {ex.Message}");
            return StatusCode(500, new { message = $"An error occurred while updating the cart item: {ex.Message}" });
        }
    }


    // Remove an item from the cart
    [HttpDelete("remove-item/{cartItemId}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        try
        {
            var cartItem = await _context.CartItems.FindAsync(cartItemId);
            if (cartItem == null)
            {
                return NotFound(new { message = "Cart item not found." });
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cart item removed." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error removing cart item: {ex.Message}");
            return StatusCode(500, new { message = $"An error occurred while removing the cart item: {ex.Message}" });
        }
    }

    // Delete all items from the cart
    [HttpDelete("clear-cart/{userId}")]
    public async Task<IActionResult> ClearCart(int userId)
    {
        try
        {
            // Find the user's cart
            var cart = await _context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (cart == null || !cart.CartItems.Any())
            {
                return NotFound(new { message = "The cart is already empty or does not exist." });
            }

            // Remove all items from the cart
            _context.CartItems.RemoveRange(cart.CartItems);
            await _context.SaveChangesAsync();

            return Ok(new { message = "All items have been removed from the cart." });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error clearing the cart: {ex.Message}");
            return StatusCode(500, new { message = $"An error occurred while clearing the cart: {ex.Message}" });
        }
    }

    public class AddToCartRequest
    {
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
