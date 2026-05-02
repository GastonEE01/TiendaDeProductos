using MercadoPago.Config;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Add services to the container.
builder.Services.AddControllers()
     .AddJsonOptions(options =>
     {
         options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
     });

var app = builder.Build();

app.UseCors("AllowAll");

app.MapControllers();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

var mpSection = builder.Configuration.GetSection("MercadoPago");
var accessToken = mpSection["AccessToken"];

MercadoPago.Config.MercadoPagoConfig.AccessToken = accessToken;

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

Console.WriteLine("ENV: " + builder.Environment.EnvironmentName);
Console.WriteLine("TOKEN: " + accessToken);
app.Run();
