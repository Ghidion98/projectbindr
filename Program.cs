using Umbraco.Cms.Web.Common.ApplicationBuilder;

var builder = WebApplication.CreateBuilder(args);

// Configure Umbraco defaults and services
builder.Host.ConfigureUmbracoDefaults();

builder.Services.AddUmbraco(builder.Environment, builder.Configuration)
    .AddBackOffice()
    .AddWebsite()
    .AddComposers();

var app = builder.Build();

// Use Umbraco middleware
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
    });

app.Run();
