using backend.DataContext;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Adatb�zis kapcsolat be�ll�t�sa
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))));

// CORS be�ll�t�sa
const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:3000", "http://192.168.1.137:3000") // A frontend URL-j�t enged�lyezi
                  .AllowAnyMethod() // B�rmely HTTP met�dus enged�lyez�se
                  .AllowAnyHeader() // B�rmilyen header enged�lyez�se
                  .AllowCredentials(); // Hiteles�t�si adatok enged�lyez�se (pl. s�tik)
        });
});

// MVC �s Controller-ek hozz�ad�sa
builder.Services.AddControllers();

// Swagger be�ll�t�sa a fejleszt�si k�rnyezethez
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();
}

var app = builder.Build();

// Swagger haszn�lata fejleszt�si k�rnyezetben
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS enged�lyez�se
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();
app.MapControllers();

app.Run();
