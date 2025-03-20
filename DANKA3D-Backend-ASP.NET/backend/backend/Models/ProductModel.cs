using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    [Table("products")]
    public class ProductModel
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string? Name { get; set; }

        [Required]
        public string? Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [MaxLength(50)]
        [Column("color")]
        public string? Color { get; set; }

        [MaxLength(255)]
        [Column("image_url")]
        public string? ImageUrl { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
