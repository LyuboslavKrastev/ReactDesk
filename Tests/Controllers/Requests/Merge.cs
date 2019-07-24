using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactDesk.Controllers;
using ReactDesk.Helpers.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Controllers.Requests
{
    public class Merge
    {
        [Fact]
        public async Task ShouldReturnBadRequest_IfNoIdsAreProvided()
        {
            var fakeRequstsService = new Mock<IRequestService>();

            var fakeUserIdentifier = new Mock<IUserIdentifier>();
            //fakeUserIdentifier
            //    .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
            //    .Returns(new User());

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);

            var result = await controller.Merge(new List<int>());

            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task ShouldReturnBadRequest_OnInvalidOperationException()
        {
            var fakeRequstsService = new Mock<IRequestService>();

            var fakeUserIdentifier = new Mock<IUserIdentifier>();
            User user = GetUser();

            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(user);

            fakeUserIdentifier
                .Setup(f => f.IsTechnician(It.IsAny<int>()))
                .Returns(true);

            fakeRequstsService
                .Setup(f => f.Merge(It.IsAny<IEnumerable<int>>(), It.IsAny<string>(), It.IsAny<bool>()))
                .Throws<InvalidOperationException>();

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);

            var result = await controller.Merge(new List<int>() { 1 });
            var resultObject = result;
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task ShouldReturnBadRequest_OnArgumentException()
        {
            var fakeRequstsService = new Mock<IRequestService>();
            var fakeUserIdentifier = new Mock<IUserIdentifier>();
            User user = GetUser();

            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(user);

            fakeUserIdentifier
                .Setup(f => f.IsTechnician(It.IsAny<int>()))
                .Returns(true);

            fakeRequstsService
                .Setup(f => f.Merge(It.IsAny<IEnumerable<int>>(), It.IsAny<string>(), It.IsAny<bool>()))
                .Throws<ArgumentException>();

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);

            var result = await controller.Merge(new List<int>() { 1 });
            var resultObject = result;
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task ShouldReturnOkObjectResult()
        {
            var fakeRequstsService = new Mock<IRequestService>();

            IQueryable<Request> request = new[] { new Request() }.AsQueryable(); ;

            var fakeUserIdentifier = new Mock<IUserIdentifier>();

            User user = GetUser();

            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(user);

            fakeUserIdentifier
                .Setup(f => f.IsTechnician(It.IsAny<int>()))
                .Returns(true);

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);

            var result = await controller.Merge(new List<int>() { 1, 2 });

            Assert.IsType<OkObjectResult>(result);
        }

        private static User GetUser()
        {
            return new User()
            {
                Id = "FirstUserGuid",
                Username = "FirstUsername",
                FullName = "First Fullname",
            };
        }
    }
}
