using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;
using static System.Runtime.InteropServices.JavaScript.JSType;

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

        private static List<object> _products = new List<object>
        {
            new { id = 1, nombre =  "Laptop", precio = 1200, categoria = "tecnologia", imagen = "💻" },
            new { id = 2, nombre = "Auriculares", precio = 150, categoria = "tecnologia", imagen = "🎧" },
            new { id = 3, nombre = "Remera", precio = 30, categoria = "ropa", imagen = "👕" },
            new { id = 4, nombre = "Zapatillas", precio = 90, categoria = "ropa", imagen = "👟" },
            new { id = 5, nombre = "Mochila", precio = 60, categoria = "accesorios", imagen = "🎒" },
            new { id = 6, nombre = "Reloj", precio = 200, categoria = "accesorios", imagen = "⌚" },
        };

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_products);
        }

        [HttpPost]
        public IActionResult Post([FromBody] object product)
        {
            _products.Add(product);
            return Ok(product);
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
