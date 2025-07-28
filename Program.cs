using Umbraco.Cms.Web.Common.ApplicationBuilder;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

// ✅ REQUIRED for Umbraco to configure hosting defaults
builder.Host.ConfigureUmbracoDefaults();

// ✅ REQUIRED: Add Umbraco services and BUILD them
builder.Services.AddUmbraco(builder.Environment, builder.Configuration)
    .AddBackOffice()
    .AddWebsite()
    .AddComposers()
    .Build(); // ❗️This line is REQUIRED — otherwise you get the IMapperCollection error

// ✅ Optional: your own services
builder.Services.AddControllers();
builder.Services.AddSignalR();

// ✅ Build the app
var app = builder.Build();

// ✅ Configure Umbraco Middleware + Endpoints
app.UseUmbraco()
    .WithMiddleware(u =>
    {
        u.UseBackOffice();
        u.UseWebsite();
    })
    .WithEndpoints(u =>
    {
        u.UseBackOfficeEndpoints();
        u.UseWebsiteEndpoints();
        app.MapControllers();          // if you use MVC controllers
        app.MapHub<MyHub>("/hub");     // if you use SignalR
    });

app.Run();
