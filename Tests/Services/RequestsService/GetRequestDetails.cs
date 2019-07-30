using BasicDesk.Data;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Xunit;

namespace Tests.Services.RequestsService
{
    public class GetRequestDetails : IDisposable
    {
        private readonly BasicDeskDbContext context;
        private readonly IRequestsService service;

        public GetRequestDetails()
        {
            var options = new DbContextOptionsBuilder<BasicDeskDbContext>()
                  .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;
            this.context = new BasicDeskDbContext(options);
            var repository = new DbRepository<Request>(this.context);
            this.service = new BasicDesk.Services.RequestsService(repository, null, null, null, null);
        }

        public void Dispose()
        {
			// clears the in-memory database after each test
            this.context.Database.EnsureDeleted();
            this.context.Dispose();
        }

        [Fact]
        public void ShouldReturnDetails_IfUserIsNotTechnician_AndUserIsTheAuthor()
        {
            // Arrange
            var userId = "FirstUserGuid";
            var isTechnician = false;

            var request = new Request
            {
                Id = 1,
                Subject = "First",
                Description = "I am the first",
                CategoryId = 1,
                RequesterId = userId
            };

            this.context.Add(request);
            this.context.SaveChanges();

            // Act
            var result = this.service.ById(1, userId, isTechnician).FirstOrDefault(); ;

            // Assert (expected, actual)
            Assert.Equal(request, result);
        }

        [Fact]
        public void ShouldNotReturnDetails_IfUserIsNotTechnician_AndUserIsNotTheAuthor()
        {
            // Arrange
            var userId = "FirstUserGuid";
            var isTechnician = false;

            var request = new Request
            {
                Id = 1,
                Subject = "First",
                Description = "I am the first",
                CategoryId = 1,
                RequesterId = "SomeOtherUserId"
            };

            this.context.Add(request);
            this.context.SaveChanges();

            // Act
            var result = this.service.ById(1, userId, isTechnician).FirstOrDefault(); ;

            // Assert (expected, actual)
            Assert.NotEqual(request, result);
        }

        [Fact]
        public void ShouldReturnDetails_IfUserIsTechnician_AndUserIsTheAuthor()
        {
            // Arrange
            var userId = "FirstUserGuid";
            var isTechnician = true;

            var request = new Request
            {
                Id = 1,
                Subject = "First",
                Description = "I am the first",
                CategoryId = 1,
                RequesterId = userId
            };

            this.context.Add(request);
            this.context.SaveChanges();

            // Act
            var result = this.service.ById(1, userId, isTechnician).FirstOrDefault(); ;

            // Assert (expected, actual)
            Assert.Equal(request, result);
        }

        [Fact]
        public void ShouldReturnDetails_IfUserIsTechnician_AndUserIsNotTheAuthor()
        {
            // Arrange
            var userId = "FirstUserGuid";
            var isTechnician = true;

            var request = new Request
            {
                Id = 1,
                Subject = "First",
                Description = "I am the first",
                CategoryId = 1,
                RequesterId = "SomeOtherUserId"
            };

            this.context.Add(request);
            this.context.SaveChanges();

            // Act
            var result = this.service.ById(1, userId, isTechnician).FirstOrDefault(); ;

            // Assert (expected, actual)
            Assert.Equal(request, result);
        }
    }
}
