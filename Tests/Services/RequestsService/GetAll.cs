using BasicDesk.App.Models.Common;
using BasicDesk.Data;
using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Services.RequestsService
{
    public class GetAll : IDisposable
    {
        private readonly BasicDeskDbContext  context;
        private readonly IRequestService service;

        public GetAll()
        {
            var options = new DbContextOptionsBuilder<BasicDeskDbContext>()
                  .UseInMemoryDatabase(databaseName: "InMemory_Database").Options;
            context = new BasicDeskDbContext(options);
            var repository = new DbRepository<Request>(context);
            this.service = new RequestService(repository, null, null, null, null);
        }

        public void Dispose()
        {
            // clears the in-memory database after a test
            context.Database.EnsureDeleted();
        }

        #region GetAll_Tests
        [Fact]
        public async Task ShouldReturnAllRequests_IfTheUserIsTechnician_AndNoFiltersAreApplied()
        {
            // Arrange          

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
            var resultQueryable = this.service.GetAll(userId, isTechnician, new TableFilteringModel());

            // Assert (expectedResult, result)
            var expectedCount = 2;
            var expectedIds = requests
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }

        [Fact]
        public async Task ShouldReturnOnlyOwnRequests_IfTheUserIsNotTechnician_AndNoFiltersAreApplied()
        {
            // Arrange
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

            var userId = "SomeGuidForFirstUser";
            var isTechnician = false;

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();

            // Act
            var resultQueryable = service.GetAll(userId, isTechnician, new TableFilteringModel());

            // Assert (expectedResult, result)
            var expectedCount = 1;
            var expectedIds = requests
                .Where(r => r.RequesterId == userId)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);

        }

        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingById()
        {
            // Arrange          

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
            var model = new TableFilteringModel
            {
                IdSearch = 1
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 1;
            var expectedIds = requests
                .Where(r => r.Id == model.IdSearch)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }

        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingBySubject()
        {
            // Arrange          

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
            var model = new TableFilteringModel
            {
                SubjectSearch = "Second"
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 1;
            var expectedIds = requests
                .Where(r => r.Subject == model.SubjectSearch)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }

        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingByRequester()
        {
            // Arrange          

            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;
            var userService = new UserService(this.context, null);

            var firstRequester = new User
            {
                Id = "SomeGuidForFirstUser",
                Username = "FirstRequesterUsername",
                FullName = "First Requster Name",
                Email = "first@first.com"
            };

            var secondRequester = new User
            {
                Id = "SomeGuidForSecondUser",
                Username = "SecondRequesterUsername",
                FullName = "Second Requster Name",
                Email = "first@first.com"
            };

            userService.Create(firstRequester, "somePassword");
            userService.Create(secondRequester, "otherPassword");

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id
                },
                     new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();
            var model = new TableFilteringModel
            {
                RequesterSearch = "Second Requster Name"
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 2;
            var expectedIds = requests
                .Where(r => r.Requester.FullName == model.RequesterSearch)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }


        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingByStartTime()
        {
            // Arrange          

            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;
            var firstStartTime = DateTime.Now;
            var secondStartTime = DateTime.Now.AddDays(1);

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser",
                    StartTime = firstStartTime
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser",
                    StartTime = secondStartTime
                },
                    new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser",
                    StartTime = firstStartTime
                },
                                 new Request
                {
                    Id = 4,
                    Subject = "Fourth",
                    Description = "I am the fourth",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser",
                    StartTime = secondStartTime
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();

            var model = new TableFilteringModel
            {
                StartTimeSearch = secondStartTime.ToShortDateString()
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 2;
            var expectedIds = requests
                .Where(r => r.StartTime == secondStartTime)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }

        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingByEndTime()
        {
            // Arrange          

            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;
            var firstEndTime = DateTime.Now;
            var secondEndTime = DateTime.Now.AddDays(1);

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser",
                    EndTime = firstEndTime
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = "SomeGuidForSecondUser",
                    EndTime = secondEndTime
                },
                    new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser",
                    EndTime = firstEndTime
                },
                                 new Request
                {
                    Id = 4,
                    Subject = "Fourth",
                    Description = "I am the fourth",
                    CategoryId = 1,
                    RequesterId = "SomeGuidForFirstUser",
                    EndTime = secondEndTime
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();

            var model = new TableFilteringModel
            {
                EndTimeSearch = secondEndTime.ToShortDateString()
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 2;
            var expectedIds = requests
                .Where(r => r.EndTime == secondEndTime)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }

        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingBySubjectAndRequester()
        {
            // Arrange          

            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;
            var userService = new UserService(this.context, null);
            var commonSubject = "Common Subject";

            var firstRequester = new User
            {
                Id = "SomeGuidForFirstUser",
                Username = "FirstRequesterUsername",
                FullName = "First Requster Name",
                Email = "first@first.com"
            };

            var secondRequester = new User
            {
                Id = "SomeGuidForSecondUser",
                Username = "SecondRequesterUsername",
                FullName = "Second Requster Name",
                Email = "first@first.com"
            };

            userService.Create(firstRequester, "somePassword");
            userService.Create(secondRequester, "otherPassword");

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = "First",
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id
                },
                     new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id
                },
                      new Request
                {
                    Id = 4,
                    Subject = commonSubject,
                    Description = "I am the fourth",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id
                },
                       new Request{
                    Id = 5,
                    Subject = commonSubject,
                    Description = "I am the fifth",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();
            var model = new TableFilteringModel
            {
                SubjectSearch = commonSubject,
                RequesterSearch = "First Requster Name"
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 2;
            var expectedIds = requests
                .Where(r => r.Requester.FullName == model.RequesterSearch && r.Subject == commonSubject)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }


        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingBySubjectAndRequesterAndStartTime()
        {
            // Arrange          

            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;
            var userService = new UserService(this.context, null);
            var commonSubject = "Common Subject";
            var firstStartTime = DateTime.Now;
            var secondStartTime = DateTime.Now.AddDays(1);

            var firstRequester = new User
            {
                Id = "SomeGuidForFirstUser",
                Username = "FirstRequesterUsername",
                FullName = "First Requster Name",
                Email = "first@first.com"
            };

            var secondRequester = new User
            {
                Id = "SomeGuidForSecondUser",
                Username = "SecondRequesterUsername",
                FullName = "Second Requster Name",
                Email = "first@first.com"
            };

            userService.Create(firstRequester, "somePassword");
            userService.Create(secondRequester, "otherPassword");

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = commonSubject,
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id,
                    StartTime = firstStartTime
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id,
                    StartTime = firstStartTime
                },
                     new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id,
                    StartTime = firstStartTime
                },
                      new Request
                {
                    Id = 4,
                    Subject = commonSubject,
                    Description = "I am the fourth",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id,
                    StartTime = secondStartTime
                },
                       new Request{
                    Id = 5,
                    Subject = commonSubject,
                    Description = "I am the fifth",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id,
                    StartTime = secondStartTime
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();
            var model = new TableFilteringModel
            {
                SubjectSearch = commonSubject,
                RequesterSearch = "First Requster Name",
                StartTimeSearch = firstStartTime.ToShortDateString()
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 1;
            var expectedIds = requests
                .Where(r => r.Requester.FullName == firstRequester.FullName
                && r.Subject == commonSubject
                && r.StartTime == firstStartTime)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }

        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenSearchingBySubjectAndRequesterAndEndTime()
        {
            // Arrange          

            var userId = "SomeGuidForFirstUser";
            var isTechnician = true;
            var userService = new UserService(this.context, null);
            var commonSubject = "Common Subject";
            var firstStartTime = DateTime.Now;
            var secondStartTime = DateTime.Now.AddDays(1);
            var firstEndTime = DateTime.Now.AddDays(3);
            var secondEndTime = DateTime.Now.AddDays(5);

            var firstRequester = new User
            {
                Id = "SomeGuidForFirstUser",
                Username = "FirstRequesterUsername",
                FullName = "First Requster Name",
                Email = "first@first.com"
            };

            var secondRequester = new User
            {
                Id = "SomeGuidForSecondUser",
                Username = "SecondRequesterUsername",
                FullName = "Second Requster Name",
                Email = "first@first.com"
            };

            userService.Create(firstRequester, "somePassword");
            userService.Create(secondRequester, "otherPassword");

            var requests = new List<Request>
            {
                new Request
                {
                    Id = 1,
                    Subject = commonSubject,
                    Description = "I am the first",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id,
                    StartTime = firstStartTime,
                    EndTime = secondEndTime
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id,
                    StartTime = firstStartTime,
                    EndTime = secondEndTime
                },
                     new Request
                {
                    Id = 3,
                    Subject = "Third",
                    Description = "I am the third",
                    CategoryId = 2,
                    RequesterId = secondRequester.Id,
                    StartTime = firstStartTime,
                    EndTime = firstEndTime
                },
                      new Request
                {
                    Id = 4,
                    Subject = commonSubject,
                    Description = "I am the fourth",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id,
                    StartTime = firstStartTime,
                    EndTime = secondEndTime,
                },
                       new Request{
                    Id = 5,
                    Subject = commonSubject,
                    Description = "I am the fifth",
                    CategoryId = 1,
                    RequesterId = firstRequester.Id,
                    StartTime = secondStartTime,
                    EndTime = firstEndTime
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();
            var model = new TableFilteringModel
            {
                SubjectSearch = commonSubject,
                RequesterSearch = "First Requster Name",
                StartTimeSearch = firstStartTime.ToShortDateString(),
                EndTimeSearch = secondEndTime.ToShortDateString()
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 2;
            var expectedIds = requests
                .Where(r => r.Requester.FullName == firstRequester.FullName
                && r.Subject == commonSubject
                && r.StartTime == firstStartTime 
                && r.EndTime == secondEndTime)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }

     
        [Fact]
        public async Task ShouldReturnCorrectRequests_WhenFilteringByStatus()
        {
            // Arrange          

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
                    StatusId = 1,
                    RequesterId = "SomeGuidForFirstUser"
                },
                  new Request
                {
                    Id = 2,
                    Subject = "Second",
                    Description = "I am the second",
                    CategoryId = 2,
                    StatusId = 2,
                    RequesterId = "SomeGuidForSecondUser"
                },
            };

            await this.service.AddRangeAsync(requests);
            await this.service.SaveChangesAsync();
            var model = new TableFilteringModel
            {
                StatusId = 2
            };

            // Act
            var resultQueryable = this.service.GetAll(userId, isTechnician, model);

            // Assert (expectedResult, result)
            var expectedCount = 1;
            var expectedIds = requests
                .Where(r => r.StatusId == model.StatusId)
                .Select(r => r.Id)
                .OrderByDescending(r => r); // they are ordered by desc by default

            var actualIds = resultQueryable
                .Select(r => r.Id)
                .ToArray();

            Assert.Equal(expectedCount, actualIds.Length);
            Assert.Equal(expectedIds, actualIds);
        }
        #endregion
    }
}
