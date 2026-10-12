using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MercadoExpress.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductoImagenes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductoImagenes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    ProductoId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductoImagenes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductoImagenes_Productos_ProductoId",
                        column: x => x.ProductoId,
                        principalTable: "Productos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductoImagenes_ProductoId_SortOrder",
                table: "ProductoImagenes",
                columns: new[] { "ProductoId", "SortOrder" });

            migrationBuilder.Sql("""
                INSERT INTO "ProductoImagenes" ("Id", "Url", "SortOrder", "ProductoId")
                SELECT gen_random_uuid(), "IMG", 0, "Id"
                FROM "Productos"
                WHERE COALESCE("IMG", '') <> '';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductoImagenes");
        }
    }
}
