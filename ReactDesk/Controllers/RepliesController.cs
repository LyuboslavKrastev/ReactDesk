using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepliesController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IRequestService requestService;
        private readonly IUserRoleService userRoleService;

        public RepliesController(IUserService userService, IRequestService requestService, IUserRoleService userRoleService)
        {
            this.userService = userService;
            this.requestService = requestService;
            this.userRoleService = userRoleService;
        }

        [HttpPost]
        public async Task<IActionResult> Post(ReplyCreationBindingModel model)
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var user = this.userService.GetById(userId);
            bool isTechnician = User.IsInRole(WebConstants.AdminRoleName) || User.IsInRole(WebConstants.HelpdeskRoleName);

            await this.requestService.AddReply(model.RequestId, userId, isTechnician, model.Description);

            return Ok("Reply added successfully");
        }
    }

}
