using backend.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace backend.DataContext
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<ProductModel> Products { get; set; }
        public DbSet<CartModel> Carts { get; set; }
        public DbSet<CartItemModel> CartItems { get; set; }
        public DbSet<OrderModel> Orders { get; set; }
        public DbSet<OrderProductModel> OrderProducts {get; set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<OrderModel>()
                .HasMany(o => o.OrderProducts)               
                .WithOne()                                   
                .HasForeignKey(op => op.OrderId)             
                .OnDelete(DeleteBehavior.Cascade);          
        }

    }
}
