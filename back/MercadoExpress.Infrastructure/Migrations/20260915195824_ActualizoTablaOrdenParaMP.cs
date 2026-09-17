using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MercadoExpress.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ActualizoTablaOrdenParaMP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MercadoPagoPreferenceId",
                table: "Ordenes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PaymentUrl",
                table: "Ordenes",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MercadoPagoPreferenceId",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "PaymentUrl",
                table: "Ordenes");
        }
    }
}
