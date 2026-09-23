using AutoMapper;
using Azure.Identity;
using MercadoExpress.API.Middlewares;
using MercadoExpress.Application.Interface;
using MercadoExpress.Application.UseCase.MercadoPagos;
using MercadoExpress.Application.UseCase.Notificaciones;
using MercadoExpress.Application.UseCase.Ordenes;
using MercadoExpress.Application.UseCase.Productos;
using MercadoExpress.Application.UseCase.Usuarios;
using MercadoExpress.Infrastructure.Data;
using MercadoExpress.Infrastructure.Repositories;
using MercadoExpress.Infrastructure.Services;
using MercadoPago.Config;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddHttpClient();
builder.Services.AddScoped<IJwtTokenGenerator, JWTService>();
// Repositorios
builder.Services.AddScoped<IUsuarioRepository,UsuarioRepository>();
builder.Services.AddScoped<IProductoRepository, ProductoRepository>();
builder.Services.AddScoped<ICategoriaRepository, CategoriaRepository>();
builder.Services.AddScoped<IOrdenRepository, OrdenRepository>();
builder.Services.AddScoped<INotificacionRepository, NotificacionRepository>();
builder.Services.AddScoped<IOauthStateRepository, OauthStateRepository>();
builder.Services.AddScoped<IMercadoPagoAuthRepository, MercadoPagoAuthRepository>();

// Casos de uso
builder.Services.AddScoped<RegisterUserUseCase>();
builder.Services.AddScoped<LoginUserUseCase>();
builder.Services.AddScoped<UpdateUserUseCase>();

builder.Services.AddScoped<AddProductoUseCase>();
builder.Services.AddScoped<DeleteProductoUseCase>();
builder.Services.AddScoped<UpdateProductoUseCase>();
builder.Services.AddScoped<GetProductoUseCase>();
builder.Services.AddScoped<GetProductoVendedorUseCase>();

builder.Services.AddScoped<AddOrdenUseCase>();
builder.Services.AddScoped<GetCustomerCartClientUseCase>();
builder.Services.AddScoped<SimulatePaymentWebhookUseCase>();
builder.Services.AddScoped<UpdateStateOrdenShippedUseCase>();
builder.Services.AddScoped<UpdateOrdenDeliveredUseCase>();

builder.Services.AddScoped<GetNotificacionUserAdminUseCase>();
builder.Services.AddScoped<MarkNotificationsReadUseCase>();

builder.Services.AddScoped<ConnectMercadoPagoUseCase>();
builder.Services.AddScoped<MercadoPagoCallbackUseCase>();

builder.Services.AddAutoMapper(cfg => { }, typeof(MercadoExpress.Application.Mapper.Mappers));

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
                "https://tienda-de-productos-ivory.vercel.app/"   // Tu React publicado en Vercel
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


var app = builder.Build();

app.UseStaticFiles();

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

var tokenMercadoPago = Environment.GetEnvironmentVariable("MercadoPago__AccessToken")
                    ?? Environment.GetEnvironmentVariable("MercadoPago:AccessToken");

// Si no lo encuentra en las variables manuales de la nube, recurre al sistema automático del appsettings local
if (string.IsNullOrEmpty(tokenMercadoPago))
{
    tokenMercadoPago = app.Configuration.GetSection("MercadoPago:AccessToken").Value;
}

Console.WriteLine($"===> CONFIGURANDO SDK DE MERCADO PAGO. ¿Posee Token?: {!string.IsNullOrEmpty(tokenMercadoPago)}");

// Inicializamos el SDK con la credencial masticada y cargada al 100%
//MercadoPagoConfig.AccessToken = tokenMercadoPago;
MercadoPagoConfig.AccessToken = tokenMercadoPago?.Trim();


app.Run();
