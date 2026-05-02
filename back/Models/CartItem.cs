namespace TiendaDeProductosBack.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double Precio { get; set; }
        public int Quantity { get; set; }
    }
}
