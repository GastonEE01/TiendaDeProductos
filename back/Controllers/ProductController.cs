using MercadoPago.Client.Preference;
using MercadoPago.Resource.Preference;
using Microsoft.AspNetCore.Mvc;
using TiendaDeProductosBack.Models;

namespace TiendaDeProductosBack.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        // GET: ProductController
        /*public ActionResult Index()
        {
            return View();
        }*/

        private static List<Product> _products = new List<Product>
        {
            new Product { Id = 1, Name =  "Laptop", Precio = 1200, Categoria = "tecnologia", Imagen = "💻" },
            new Product { Id = 2, Name = "Auriculares", Precio = 150, Categoria = "tecnologia", Imagen = "🎧" },
            new Product { Id = 3, Name = "Remera", Precio = 30, Categoria = "ropa", Imagen = "👕" },
            new Product { Id = 4, Name = "Zapatillas", Precio = 90, Categoria = "ropa", Imagen = "👟" },
            new Product { Id = 5, Name = "Mochila", Precio = 60, Categoria = "accesorios", Imagen = "🎒" },
            new Product { Id = 6, Name = "Reloj", Precio = 200, Categoria = "accesorios", Imagen = "⌚" },
        };

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_products);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Product product)
        {
            _products.Add(product);
            return Ok(product);
        }

        [HttpPost("create_preference")]
        public async Task<IActionResult> CreatePreference([FromBody] List<CartItem> cart)
        {
            if( cart == null || !cart.Any() )
            {
                return BadRequest("El carrito esta vacio");
            }

            var items = cart.Select(p => new PreferenceItemRequest
            {
                Title = p.Name,
                Quantity = 1,
                CurrencyId = "ARS",
                UnitPrice = (decimal)p.Precio
            }).ToList();


            /*   var request = new PreferenceRequest
               {
                   Items = new List<PreferenceItemRequest>
           {
               new PreferenceItemRequest
               {
                   Title = "Mi producto",
                   Quantity = 1,
                   CurrencyId = "ARS",
                   UnitPrice = 75.56m
               }
           }
               };*/

            var request = new PreferenceRequest
            {
                Items = items
            };

            var client = new PreferenceClient();
            var preference = await client.CreateAsync(request);
            
            return Ok(new {id = preference.Id});
        }

        // GET: ProductController/Details/5
        /*  public ActionResult Details(int id)
          {
              return View();
          }

          // GET: ProductController/Create
          public ActionResult Create()
          {
              return View();
          }

          // POST: ProductController/Create
          [HttpPost]
          [ValidateAntiForgeryToken]
          public ActionResult Create(IFormCollection collection)
          {
              try
              {
                  return RedirectToAction(nameof(Index));
              }
              catch
              {
                  return View();
              }
          }

          // GET: ProductController/Edit/5
          public ActionResult Edit(int id)
          {
              return View();
          }

          // POST: ProductController/Edit/5
          [HttpPost]
          [ValidateAntiForgeryToken]
          public ActionResult Edit(int id, IFormCollection collection)
          {
              try
              {
                  return RedirectToAction(nameof(Index));
              }
              catch
              {
                  return View();
              }
          }

          // GET: ProductController/Delete/5
          public ActionResult Delete(int id)
          {
              return View();
          }

          // POST: ProductController/Delete/5
          [HttpPost]
          [ValidateAntiForgeryToken]
          public ActionResult Delete(int id, IFormCollection collection)
          {
              try
              {
                  return RedirectToAction(nameof(Index));
              }
              catch
              {
                  return View();
              }
          }*/

    }
}
