using AutoMapper;
using BasicDesk.App.Models.Common.ViewModels.Requests;
using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Mapping;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Moq;
using ReactDesk.Controllers;
using ReactDesk.Helpers;
using ReactDesk.Helpers.Interfaces;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Xunit;

namespace Tests.Controllers.Requests
{
    public class GetById
    {
        public GetById()
        {
			// The controller uses the mapper
            AutoMapperConfig.RegisterMappings();
        }

        [Fact]
        public void ShouldReturnNotFound_IfRequestDoesNotExist()
        {
            //Arrange  
            var fakeRequstsService = new Mock<IRequestService>();

           IQueryable<Request> request = new[] { new Request() }.AsQueryable(); ;

            fakeRequstsService
                .Setup(f => f.GetRequestDetails(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool>()))
                .Returns(request);

            var fakeUserIdentifier = new Mock<IUserIdentifier>();
            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(new User());

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);
            var requestId = 5;

            //Act  
            var result = controller.GetById(requestId);

            //Assert  
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public void ShouldReturnOk_IfRequestDoesExist()
        {
            //Arrange  
            var fakeRequstsService = new Mock<IRequestService>();
            Request request = GetRequest();
            IQueryable<Request> requestQueryable = new[] { request }.AsQueryable();

            fakeRequstsService
                .Setup(f => f.GetRequestDetails(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool>()))
                .Returns(requestQueryable);

            var fakeUserIdentifier = new Mock<IUserIdentifier>();
            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(new User() { Id = "SomeGuidForFirstUser" });

            fakeUserIdentifier
               .Setup(f => f.IsTechnician(It.IsAny<int>()))
               .Returns(true);

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);
            var requestId = 5;

            //Act  
            var result = controller.GetById(requestId);

            //Assert  
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public void ShouldReturnBadRequest_IfUserIsNull()
        {
            //Arrange  
            var fakeRequstsService = new Mock<IRequestService>();

            IQueryable<Request> request = new[] { new Request() }.AsQueryable(); ;

            fakeRequstsService
                .Setup(f => f.GetRequestDetails(It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool>()))
                .Returns(request);
            User user = null;
            var fakeUserIdentifier = new Mock<IUserIdentifier>();
            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(user);

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);
            var requestId = 5;

            //Act  
            var result = controller.GetById(requestId);

            //Assert  
            Assert.IsType<BadRequestResult>(result);
        }

        private static Request GetRequest()
        {
            var user = new User
            {
                Id = "SomeGuidForFirstUser",
                Username = "SomeUsername",
                FullName = "Full Name",
                Email = "email@email"
            };

            var category = new RequestCategory
            {
                Id = 1,
                Name = "First Category"
            };
            var status = new RequestStatus
            {
                Id = 1,
                Name = "Open"
            };

            var request = new Request
            {
                Id = 1,
                Subject = "First",
                Description = "I am the first",
                CategoryId = category.Id,
                Category = category,
                RequesterId = user.Id,
                Requester = user,
                StatusId = status.Id,
                Status = status
            };
            return request;
        }
    }
}
