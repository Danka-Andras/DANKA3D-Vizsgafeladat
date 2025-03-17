using backend.DataContext;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adatbázis kapcsolat beállítása
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

// CORS beállítása
const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://192.168.1.137:3000") // A frontend URL-jét engedélyezi
                  .AllowAnyMethod() // Bármely HTTP metódus engedélyezése
                  .AllowAnyHeader() // Bármilyen header engedélyezése
                  .AllowCredentials(); // Hitelesítési adatok engedélyezése (pl. sütik)
        });
});

// MVC és Controller-ek hozzáadása
builder.Services.AddControllers();

// Swagger beállítása a fejlesztési környezethez
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

// Swagger használata fejlesztési környezetben
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS engedélyezése
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();
app.MapControllers();

app.Run();
