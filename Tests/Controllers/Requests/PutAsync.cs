using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Requests;
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
    public class PutAsync
    {
        public PutAsync()
        {
            // The controller uses the mapper
            AutoMapperConfig.RegisterMappings();
        }

        [Fact]
        public async Task ShouldReturnUnauthorized_IfUserIsNotTechnician()
        {
            var fakeRequstsService = new Mock<IRequestService>();
            var fakeUserIdentifier = new Mock<IUserIdentifier>();
            User user = new User(); ;

            fakeUserIdentifier
                .Setup(f => f.Identify(It.IsAny<ClaimsPrincipal>()))
                .Returns(user);

            fakeUserIdentifier
                .Setup(f => f.IsTechnician(It.IsAny<int>()))
                .Returns(false);

            var controller = new RequestsController(null, fakeRequstsService.Object, null, null, fakeUserIdentifier.Object);
            var model = new RequestEditingBindingModel()
            {
                CategoryId = 1,
                StatusId = 1,
                Id = 1,
            };
            var result = await controller.PutAsync(model);
            Assert.IsType<UnauthorizedResult>(result);
        }
    }
}
