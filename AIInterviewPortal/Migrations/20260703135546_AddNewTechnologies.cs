using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace AIInterviewPortal.Migrations
{
    /// <inheritdoc />
    public partial class AddNewTechnologies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Technologies",
                columns: new[] { "TechId", "Color", "Description", "IconClass", "Name" },
                values: new object[,]
                {
                    { 7, "#E34F26", "HTML5, Semantic Elements, Forms, Accessibility, SEO", "fab fa-html5", "HTML" },
                    { 8, "#1572B6", "Flexbox, Grid, Animations, Media Queries, BEM Methodology", "fab fa-css3-alt", "CSS" },
                    { 9, "#61DAFB", "Components, Hooks, State Management, JSX, Virtual DOM", "fab fa-react", "React" },
                    { 10, "#DD0031", "Components, Services, RxJS, Dependency Injection, Routing", "fab fa-angular", "Angular" },
                    { 11, "#339933", "Express, REST APIs, Middleware, Event Loop, Streams", "fab fa-node-js", "Node.js" },
                    { 12, "#3178C6", "Types, Interfaces, Generics, Enums, Type Guards", "fas fa-code", "TypeScript" },
                    { 13, "#47A248", "Documents, Aggregation Pipeline, Indexing, Replica Sets", "fas fa-leaf", "MongoDB" },
                    { 14, "#FF9900", "EC2, S3, Lambda, IAM, CloudFormation Basics", "fab fa-aws", "AWS" },
                    { 15, "#00599C", "Pointers, Memory Management, OOP, STL, Templates", "fas fa-code", "C++" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Technologies",
                keyColumn: "TechId",
                keyValue: 15);
        }
    }
}
