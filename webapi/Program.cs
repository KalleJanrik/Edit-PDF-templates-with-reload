using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Configuration;
using webapi;
using webapi.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<PdfContext>(options => options.UseInMemoryDatabase("YourInMemoryDb"));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<PdfContext>();
    SeedData(context);
}

app.Run();


void SeedData(PdfContext context)
{
    // Add your seed data here
    if (!context.PdfTemplates.Any())
    {
        context.PdfTemplates.AddRange(
            new PdfTemplate { Id = 1, Name = "Template1", HtmlContent = "<h1>Initial content</h1>", Created = DateTime.Now, LastModified = DateTime.Now }
            // Add more templates here if needed
        );
        context.SaveChanges();
    }
}