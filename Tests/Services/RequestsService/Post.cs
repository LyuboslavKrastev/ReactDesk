using BasicDesk.Data;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Services.RequestsService
{
    public class AddAsync
    {
        private readonly BasicDeskDbContext context;
        private readonly IRequestsService service;

        public AddAsync()
        {
            var options = new DbContextOptionsBuilder<BasicDeskDbContext>()
                  .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString()).Options;
            this.context = new BasicDeskDbContext(options);
            var repository = new DbRepository<Request>(this.context);
            this.service = new BasicDesk.Services.RequestsService(repository, null, null, null, null);
        }

        [Fact]
        public async Task ShouldAddRequest_IfValid()
        {
            var request = new Request()
            {
                Id = 1,
                Subject = "First",
                Description = "Desc",
                StartTime = DateTime.UtcNow,
                RequesterId = "SomeGuid"
            };

            await this.service.AddAsync(request);
            await this.service.SaveChangesAsync();

            var reqFromDb = await this.service
                .ById(1)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            Assert.Equal(request.Id, reqFromDb.Id);
            Assert.Equal(request.Subject, reqFromDb.Subject);
            Assert.Equal(request.Description, reqFromDb.Description);

        }
    }
}
