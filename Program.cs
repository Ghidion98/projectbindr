using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddKeyedSingleton<ICache, BigCache>("big");
builder.Services.AddKeyedSingleton<ICache, SmallCache>("small");
builder.Services.AddControllers();
builder.Services.AddSignalR(); // ✅ Required for SignalR

var app = builder.Build();

app.MapGet("/big", ([FromKeyedServices("big")] ICache bigCache) => bigCache.Get("date"));
app.MapGet("/small", ([FromKeyedServices("small")] ICache smallCache) => smallCache.Get("date"));

app.MapControllers();
app.MapHub<MyHub>("/hub"); // ✅ Expose your hub endpoint

app.Run();

public interface ICache
{
    object Get(string key);
}
public class BigCache : ICache
{
    public object Get(string key) => $"Resolving {key} from big cache.";
}
public class SmallCache : ICache
{
    public object Get(string key) => $"Resolving {key} from small cache.";
}

[ApiController]
[Route("/cache")]
public class CustomServicesApiController : Controller
{
    [HttpGet("big-cache")]
    public ActionResult<object> GetOk([FromKeyedServices("big")] ICache cache)
    {
        return cache.Get("data-mvc");
    }
}

public class MyHub : Hub
{
    private readonly IKeyedServiceProvider _keyed;

    public MyHub(IKeyedServiceProvider keyed)
    {
        _keyed = keyed;
    }

    public async Task Method()
    {
        var cache = _keyed.GetRequiredKeyedService<ICache>("small");
        Console.WriteLine(cache.Get("signalr"));
        await Clients.All.SendAsync("ReceiveMessage", "Resolved from small cache");
    }
}
