namespace MercadoExpress.Application.DTO.Producto
{
    public class GetProductResponse
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string IMG { get; set; } = string.Empty;
        public int Stock { get; set; }
        public string CategoriaName { get; set; } = string.Empty;
        public Guid UsuarioId { get; set; }
    }
}
