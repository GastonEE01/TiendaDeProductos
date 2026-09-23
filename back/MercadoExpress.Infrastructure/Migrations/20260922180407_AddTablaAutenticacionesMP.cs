using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MercadoExpress.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddTablaAutenticacionesMP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MercadoPagoAccessToken",
                table: "Usuarios");

            migrationBuilder.CreateTable(
                name: "AutenticacionesMP",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UsuarioId = table.Column<Guid>(type: "uuid", nullable: false),
                    AccessToken = table.Column<string>(type: "text", nullable: false),
                    RefreshToken = table.Column<string>(type: "text", nullable: false),
                    ExpiresAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MercadoPagoUserId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AutenticacionesMP", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AutenticacionesMP_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AutenticacionesMP_UsuarioId",
                table: "AutenticacionesMP",
                column: "UsuarioId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AutenticacionesMP");

            migrationBuilder.AddColumn<string>(
                name: "MercadoPagoAccessToken",
                table: "Usuarios",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
