namespace MercadoExpress.Domain.Entities
{
    public class ProductoImagen
    {
        public Guid Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public int SortOrder { get; set; }
        public Guid ProductoId { get; set; }
        public Producto Producto { get; set; } = null!;
    }
}
