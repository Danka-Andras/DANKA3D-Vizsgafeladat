using backend.DataContext;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

[Route("api/[controller]")]
[ApiController]
public class OrdersController : ControllerBase
{
    private readonly DatabaseContext _context;

    public OrdersController(DatabaseContext context)
    {
        _context = context;
    }

    // Create a new order
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] OrderModel order)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            // Input validation
            if (order == null || order.OrderProducts == null || !order.OrderProducts.Any())
            {
                return BadRequest("Invalid order data.");
            }

            // Log incoming data
            Console.WriteLine("Received Order Data:");
            Console.WriteLine(JsonConvert.SerializeObject(order));

            // Ensure `productId` exists for each item in the order
            foreach (var product in order.OrderProducts)
            {
                var productExists = await _context.Products.AnyAsync(p => p.Id == product.ProductId);
                if (!productExists)
                {
                    return BadRequest($"Product with ID {product.ProductId} does not exist.");
                }
            }

            // Create the order record
            var newOrder = new OrderModel
            {
                UserId = order.UserId,
                TotalPrice = order.TotalPrice,
                Status = "Pending", // Set default status
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(newOrder);
            await _context.SaveChangesAsync();

            // Create the associated order products
            foreach (var orderProduct in order.OrderProducts)
            {
                var newOrderProduct = new OrderProductModel
                {
                    OrderId = newOrder.Id, // Set the generated order ID
                    ProductId = orderProduct.ProductId,
                    Quantity = orderProduct.Quantity,
                    Price = orderProduct.Price,
                    ImageUrl = orderProduct.ImageUrl
                };

                _context.OrderProducts.Add(newOrderProduct);
            }

            await _context.SaveChangesAsync();

            // Commit the transaction
            await transaction.CommitAsync();

            return Ok(newOrder); // Return the created order
        }
        catch (DbUpdateException dbEx)
        {
            // Rollback on error
            await transaction.RollbackAsync();
            return BadRequest(new { message = "Database error.", details = dbEx.InnerException?.Message ?? dbEx.Message });
        }
        catch (Exception ex)
        {
            // Rollback on unexpected errors
            await transaction.RollbackAsync();
            return StatusCode(500, new { message = "An error occurred.", details = ex.InnerException?.Message ?? ex.Message });
        }
    }

    // Get orders by user ID with products
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<IEnumerable<object>>> GetOrdersByUser(int userId)
    {
        try
        {
            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderProducts) // Include associated products
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    o.TotalPrice,
                    o.Status,
                    o.CreatedAt,
                    Products = o.OrderProducts.Select(op => new
                    {
                        op.Id,
                        op.ProductId,
                        op.Quantity,
                        op.Price,
                        op.ImageUrl
                    })
                })
                .ToListAsync();

            if (!orders.Any())
            {
                Console.WriteLine($"No orders found for user ID {userId}.");
                return NotFound("No orders found for the specified user.");
            }

            Console.WriteLine($"Orders retrieved for user ID {userId}: {orders.Count}");
            return Ok(orders);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching orders for user ID {userId}: {ex.Message}");
            return StatusCode(500, new { message = "Internal server error.", details = ex.Message });
        }
    }

    // Get all orders with products and pagination
    [HttpGet]
    public async Task<ActionResult<IEnumerable<object>>> GetOrders([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        try
        {
            var orders = await _context.Orders
                .Include(o => o.OrderProducts) // Include associated products
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new
                {
                    o.Id,
                    o.UserId,
                    o.TotalPrice,
                    o.Status,
                    o.CreatedAt,
                    Products = o.OrderProducts.Select(op => new
                    {
                        op.Id,
                        op.ProductId,
                        op.Quantity,
                        op.Price,
                        op.ImageUrl
                    })
                })
                .ToListAsync();

            if (!orders.Any())
            {
                Console.WriteLine("No orders found.");
                return NotFound("No orders found.");
            }

            Console.WriteLine($"Orders retrieved: {orders.Count}");
            return Ok(orders);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching orders: {ex.Message}");
            return StatusCode(500, new { message = "Internal server error.", details = ex.Message });
        }
    }
}
