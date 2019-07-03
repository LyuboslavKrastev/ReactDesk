using Microsoft.EntityFrameworkCore.Migrations;

namespace BasicDesk.Data.Migrations
{
    public partial class SeedingCategories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "RequestCategories",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "First Category" },
                    { 2, "Second Category" },
                    { 3, "Third Category" },
                    { 4, "Fourth Category" },
                    { 5, "Fifth Category" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "RequestCategories",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "RequestCategories",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "RequestCategories",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "RequestCategories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "RequestCategories",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
