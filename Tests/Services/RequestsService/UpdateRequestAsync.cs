using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.Data;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Services.RequestsService
{
    public class UpdateRequestAsync : IDisposable
    {
        private readonly BasicDeskDbContext context;
        private readonly IRequestService service;

        public UpdateRequestAsync()
        {
            var options = new DbContextOptionsBuilder<BasicDeskDbContext>()
                  .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;
            this.context = new BasicDeskDbContext(options);
            var repository = new DbRepository<Request>(this.context);
            var statusRepository = new DbRepository<RequestStatus>(this.context);
            var categoryRepository = new DbRepository<RequestCategory>(this.context);

            var categoriesService = new CategoriesService(categoryRepository);

            this.service = new RequestService(repository, null, categoriesService, statusRepository, null);

        }

        public void Dispose()
        {
            // clears the in-memory database after each test
            this.context.Database.EnsureDeleted();
            this.context.Dispose();
        }

        [Fact]
        public async Task ShouldThrow_IfInvalidRequestHasBeenProvided()
        {
            // Arrange
            var requests = new List<Request>()
            {
                new Request
                {
                    Id = 1,
                    Subject = "First Subject",
                    Description = "First Description",
                    RequesterId = "FirstRequesterId"
                },
                new Request
                {
                    Id = 2,
                    Subject = "Second Subject",
                    Description = "Second Description",
                    RequesterId = "SecondRequesterId"
                },
            };
            await this.context.Requests.AddRangeAsync(requests);
            await this.context.SaveChangesAsync();
            var model = new RequestEditingBindingModel()
            {
                Id = 5,
            };
            // Act

            var result = await Assert.ThrowsAsync<ArgumentException>(async () => await this.service.UpdateRequestAsync(model));

            // Assert

            var expectedMessage = "Invalid request!";
            Assert.Equal(expectedMessage, result.Message);
        }

        [Fact]
        public async Task ShouldThrow_IfInvalidStatusHasBeenProvided()
        {
            // Arrange
            var statuses = new List<RequestStatus>()
            {
                new RequestStatus
                {
                    Id = 1,
                    Name = "Open"
                },
                 new RequestStatus
                {
                    Id = 2,
                    Name = "Closed"
                },
            };

            await this.context.RequestStatuses.AddRangeAsync(statuses);

            var requests = new List<Request>()
            {
                new Request
                {
                    Id = 1,
                    Subject = "First Subject",
                    Description = "First Description",
                    RequesterId = "FirstRequesterId",
                    StatusId = statuses[0].Id
                },
                new Request
                {
                    Id = 2,
                    Subject = "Second Subject",
                    Description = "Second Description",
                    RequesterId = "SecondRequesterId",
                    StatusId = statuses[1].Id
                },
            };
            await this.context.Requests.AddRangeAsync(requests);
            await this.context.SaveChangesAsync();
            var model = new RequestEditingBindingModel()
            {
                Id = 1,
                StatusId = 15
            };
            // Act

            var result = await Assert.ThrowsAsync<ArgumentException>(async () => await this.service.UpdateRequestAsync(model));

            // Assert
            var expectedMessage = "Invalid status!";
            Assert.Equal(expectedMessage, result.Message);
        }

        [Fact]
        public async Task ShouldThrow_IfInvalidCategoryHasBeenProvided()
        {
            // Arrange
            var categories = new List<RequestCategory>()
            {
                new RequestCategory
                {
                    Id = 1,
                    Name = "Open"
                },
                 new RequestCategory
                {
                    Id = 2,
                    Name = "Closed"
                },
            };

            await this.context.RequestCategories.AddRangeAsync(categories);

            var requests = new List<Request>()
            {
                new Request
                {
                    Id = 1,
                    Subject = "First Subject",
                    Description = "First Description",
                    RequesterId = "FirstRequesterId",
                    CategoryId = categories[0].Id
                },
                new Request
                {
                    Id = 2,
                    Subject = "Second Subject",
                    Description = "Second Description",
                    RequesterId = "SecondRequesterId",
                    StatusId = categories[1].Id
                },
            };
            await this.context.Requests.AddRangeAsync(requests);
            await this.context.SaveChangesAsync();
            var model = new RequestEditingBindingModel()
            {
                Id = 1,
                CategoryId = 15
            };
            // Act

            var result = await Assert.ThrowsAsync<ArgumentException>(async () => await this.service.UpdateRequestAsync(model));

            // Assert
            var expectedMessage = "Invalid category!";
            Assert.Equal(expectedMessage, result.Message);
        }
    }
}
