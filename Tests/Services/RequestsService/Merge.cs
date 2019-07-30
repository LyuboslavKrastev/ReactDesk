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
using System.Threading.Tasks;
using Xunit;

namespace Tests.Services.RequestsService
{
    public class Merge : IDisposable
    {
        private readonly BasicDeskDbContext context;
        private readonly IRequestsService service;

        public Merge()
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
        public async Task ShouldThrow_IfLessThanTwoRequestIdsHaveBeenProvided()
        {
            // Arrange
            var ids = new List<int> { 1 };
            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;
            var expectedMessage = "At least two ids are needed in order to merge.";

            // Act
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(async () => await this.service.Merge(ids, userId, isTechnician));
            var actualMessage = exception.Message;

            // Assert (expected, actual)
            Assert.Equal(expectedMessage, actualMessage);
        }

        [Fact]
        public async Task ShouldThrow_IfAnyIdIsInvalid()
        {
            // Arrange
            var firstIds = new List<int> { 1, 6, 2};
            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser"
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser"
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();

            var expectedMessage = "Invalid request id has been provided.";

            // Act
            var exception = await Assert.ThrowsAsync<ArgumentException>(async () => await this.service.Merge(firstIds, userId, isTechnician));
            var actualMessage = exception.Message;

            // Assert (expected, actual)
            Assert.Equal(expectedMessage, actualMessage);
        }

        [Fact]
        public async Task ShouldNotThrow_IfAllIdAreValid()
        {
            // Arrange
            var ids = new List<int> { 1, 2 };
            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser"
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser"
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();

            // Act
            await this.service.Merge(ids, userId, isTechnician);
        }

        [Fact]
        public async Task ShouldDeleteAllRequests_ExceptForTheOneTheyAreBeingMergedTo()
        {
            // Arrange
            var ids = new List<int> { 1, 2, 3 };
            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser"
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser"
                },
                     new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser"
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();

            // Act
            await this.service.Merge(ids, userId, isTechnician);

            // Assert

            /* Requests are merged to the last provided id, in this case => 3, so the requests with id == 1 and id == 2 
               should be converted to replies and deleted */
            var expectedRequestIds = requests.Where(r => r.Id != 1 && r.Id != 2).Select(r => r.Id);

            var actualRequestIds = this.service.GetAll().Select(r => r.Id).ToArray();

            Assert.Equal(expectedRequestIds, actualRequestIds);
        }

        [Fact]
        public async Task ShouldThrow_IfUserIsNotTechnician_AndIsNotAuthorOfOneOfTheRequests()
        {
            // Arrange
            var ids = new List<int> { 1, 2, 3 };
            var userId = "SomeGuidForFirstUser";
            var isTechnician = false;
            var expectedMessage = "A user can only merge his own requests!";

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser"
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser"
                },
                     new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser"
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();

            // Act
            var exception = await Assert.ThrowsAsync<InvalidOperationException>(async () => await this.service.Merge(ids, userId, isTechnician));
            var actualMessage = exception.Message;

            // Assert (expected, actual)
            Assert.Equal(expectedMessage, actualMessage);
        }
    }
}
