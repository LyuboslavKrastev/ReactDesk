using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.Data.Models;
using BasicDesk.Mapping;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Moq;
using ReactDesk.Controllers;
using ReactDesk.Helpers.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;
using Xunit;

namespace Tests.Controllers.Requests
{
    public class PostAsync
    {
        public PostAsync()
        {
            // The controller uses the mapper
            AutoMapperConfig.RegisterMappings();
        }
        [Fact]
        public async Task ShouldReturnOkObjectResult()
        {
            var fakeRequstsService = new Mock<IRequestsService>();
            var fakeUserIdentifier = new Mock<IUserIdentifier>();

            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(new User());

            var controller = new RequestsController(fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);
            var model = new RequestCreationBindingModel()
            {
                Subject = "First",
                Description = "First Desc",                
            };
            var result = await controller.PostAsync(model);
            Assert.IsType<OkObjectResult>(result);
        }
    }
}
