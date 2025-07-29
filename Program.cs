using Umbraco.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddUmbraco(builder.Environment, builder.Configuration)
    .AddBackOffice()
    .AddWebsite()
    .AddComposers();

var app = builder.Build();

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
        // Remove .UseInstallerEndpoints() if it causes error
    });

app.Run();
