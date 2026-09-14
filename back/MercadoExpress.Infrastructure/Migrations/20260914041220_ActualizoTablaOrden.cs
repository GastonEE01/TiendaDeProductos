using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MercadoExpress.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ActualizoTablaOrden : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Ordenes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "CommissionAmount",
                table: "Ordenes",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "CommissionPercentage",
                table: "Ordenes",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "CustomerPhone",
                table: "Ordenes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DeliveryMethod",
                table: "Ordenes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PostalCode",
                table: "Ordenes",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "SellerAmount",
                table: "Ordenes",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "CommissionAmount",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "CommissionPercentage",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "CustomerPhone",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "DeliveryMethod",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "PostalCode",
                table: "Ordenes");

            migrationBuilder.DropColumn(
                name: "SellerAmount",
                table: "Ordenes");
        }
    }
}
