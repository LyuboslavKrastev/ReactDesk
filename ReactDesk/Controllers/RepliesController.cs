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
        public async Task<IActionResult> Create(int requestId, string replyDescription)
        {
            if (string.IsNullOrWhiteSpace(replyDescription))
            {
                return BadRequest();
            }

            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var user = this.userService.GetById(userId);
            bool isTechnician = User.IsInRole(WebConstants.AdminRole) || User.IsInRole(WebConstants.HelpdeskRole);

            await this.requestService.AddReply(requestId, userId, isTechnician, replyDescription);

            return Ok();
        }
    }

}
