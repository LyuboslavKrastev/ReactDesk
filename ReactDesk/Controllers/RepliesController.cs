using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using ReactDesk.Helpers.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepliesController : ControllerBase
    {
        private readonly IUserIdentifier userIdentifier;
        private readonly IRepliesService repliesService;

        public RepliesController(IUserIdentifier userIdentifier, IRepliesService repliesService)
        {
            this.userIdentifier = userIdentifier;
            this.repliesService = repliesService;
        }

        [HttpPost]
        public async Task<IActionResult> Post(ReplyCreationBindingModel model)
        {
            User user = userIdentifier.Identify(User);
            bool isTechnician = userIdentifier.IsTechnician(user.RoleId);

            if (user == null)
            {
                return BadRequest();
            }

            await this.repliesService.AddAsync(model.RequestId, user.Id, isTechnician, model.Description);

            return Ok("Reply added successfully");
        }
    }

}
