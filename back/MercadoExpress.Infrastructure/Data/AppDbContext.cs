using MercadoExpress.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MercadoExpress.Infrastructure.Data
{
    public class AppDbContext : DbContext
    { 
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Producto> Productos { get; set; }
        public DbSet<ProductoImagen> ProductoImagenes { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<DetalleOrden> DetallesOrden { get; set; }
        public DbSet<Orden> Ordenes { get; set; }
        public DbSet<Notificacion> Notificaciones { get; set; }
        public DbSet<MercadoPagoAuth> AutenticacionesMP { get; set; }
        public DbSet<OAuthState> OAuthStates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ProductoImagen>()
                .HasOne(image => image.Producto)
                .WithMany(product => product.Images)
                .HasForeignKey(image => image.ProductoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductoImagen>()
                .HasIndex(image => new { image.ProductoId, image.SortOrder });
        }
    }
}
