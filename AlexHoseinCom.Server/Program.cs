using Domain.Services;
using Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

SetupCors();
SetupDependencyInjection();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseCors("CorsPolicy");
app.MapFallbackToFile("/index.html");

app.Run();


void SetupDependencyInjection()
{
    builder.Services.AddHttpClient();
    builder.Services.AddScoped<ILuxorTechService, LuxorTechService>();
    builder.Services.AddScoped<IBitcoinService,BitcoinService>();
}

void SetupCors()
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());
                //.AllowCredentials());
    });
}