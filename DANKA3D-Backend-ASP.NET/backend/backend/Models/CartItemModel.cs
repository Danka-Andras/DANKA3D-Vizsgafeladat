using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Models;

[Table("cart_items")]
public class CartItemModel
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("cart_id")]
    public int CartId { get; set; }

    [Required]
    [Column("product_id")]
    public int ProductId { get; set; }

    [Required]
    [Column("quantity")]
    public int Quantity { get; set; }

    [ForeignKey("CartId")]
    public CartModel? Cart { get; set; }

    [ForeignKey("ProductId")]
    public ProductModel? Product { get; set; }
}
