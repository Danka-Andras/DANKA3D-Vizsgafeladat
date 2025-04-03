using backend.DataContext;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Database connection setup
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Configure CORS
const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://192.168.1.137:3000", "192.168.1.230")  // Removed the extra space
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// **Session t�mogat�s hozz�ad�sa**
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30); // 30 perc inaktivit�s ut�n lej�r
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

// Add Controllers and other services
builder.Services.AddControllers();

// Add Swagger for API documentation in development mode
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

// Use Swagger in development mode
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware setup
//app.UseHttpsRedirection();  // T�r�lve a HTTPS �tir�ny�t�st

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "images")),
    RequestPath = "/Images"
});

app.UseCors(MyAllowSpecificOrigins);

app.UseSession(); // **Session middleware be�ll�t�sa**
app.UseAuthorization();
app.MapControllers();

app.Run();
