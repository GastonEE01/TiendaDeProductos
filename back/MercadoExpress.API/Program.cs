using AutoMapper;
using Azure.Identity;
using MercadoExpress.API.Middlewares;
using MercadoExpress.Application.Interface;
using MercadoExpress.Application.UseCase.Productos;
using MercadoExpress.Application.UseCase.Usuarios;
using MercadoExpress.Infrastructure.Data;
using MercadoExpress.Infrastructure.Repositories;
using MercadoExpress.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddScoped<IJwtTokenGenerator, JWTService>();
// Repositorios
builder.Services.AddScoped<IUsuarioRepository,UsuarioRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();


// Casos de uso
builder.Services.AddScoped<RegisterUserUseCase>();
builder.Services.AddScoped<LoginUserUseCase>();

builder.Services.AddScoped<AddProductoUseCase>();
builder.Services.AddScoped<DeleteProductoUseCase>();
builder.Services.AddScoped<UpdateProductoUseCase>();
builder.Services.AddScoped<GetProductoUseCase>();

builder.Services.AddAutoMapper(cfg => { }, typeof(MercadoExpress.Application.Mapper.Mappers));
//builder.Services.AddAutoMapper(typeof(MercadoExpress.Application.Mapper.Mappers));

// Configuracion de la Base de Datos (PostgreSQL con Neon)
var connectionString = Environment.GetEnvironmentVariable("NeonTech__connectionString");
if (string.IsNullOrEmpty(connectionString))
{
    connectionString = builder.Configuration.GetSection("NeonTech:connectionString").Value;
}
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("No se encontró la cadena de conexión 'NeonTech' en ningún entorno.");
}
Console.WriteLine($"===> CONECTANDO A LA BD: {connectionString}");
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseNpgsql(connectionString));


// Configuracion de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresá: Bearer {tu token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "TuEmisorGenérico",
            ValidAudience = "TuAudienciaGenérica",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("UnaClaveSuperSecretaYMuyLargaDeMasDe32Caracteres!"))
        };
    });


// Telemetría de Application Insights
/*builder.Services.AddApplicationInsightsTelemetry(new Microsoft.ApplicationInsights.AspNetCore.Extensions.ApplicationInsightsServiceOptions
{
    ConnectionString = builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"]
});*/
var appInsightsConnectionString = builder.Configuration["APPLICATIONINSIGHTS_CONNECTION_STRING"];
if (!string.IsNullOrEmpty(appInsightsConnectionString))
{
    builder.Services.AddApplicationInsightsTelemetry(options =>
    {
        options.ConnectionString = appInsightsConnectionString;
    });
}

// Configuracion de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",                  // Tu React en tu PC
                "https://app-peliculas-three.vercel.app"   // Tu React publicado en Vercel
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();


// Habilitar CORS como primer paso en el pipeline HTTP
app.UseCors("AllowFrontend");

// Configuración del entorno de Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();

app.UseMiddleware<ExceptionMiddleware>();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

// MIGRACIONES AUTOMÁTICAS(Para Neon en la nube
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
}


app.Run();
