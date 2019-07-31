using AutoMapper;
using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactDesk.Helpers.Interfaces;
using System.Threading.Tasks;

namespace ReactDesk.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ApprovalsController : ControllerBase
    {
        private readonly IApprovalsService approvalsService;
        private readonly IUserIdentifier userIdentifier;

        public ApprovalsController(IApprovalsService approvalsService, IUserIdentifier userIdentifier)
        {
            this.approvalsService = approvalsService;
            this.userIdentifier = userIdentifier;
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync(ApprovalCreationBindingModel model)
        {
            User user = userIdentifier.Identify(User);

            if (user == null)
            {
                return BadRequest();
            }

            RequestApproval approval = new RequestApproval
            {
                Subject = model.Subject,
                Description = model.Description,
                RequestId = model.RequestId,
                RequesterId = user.Id,
                ApproverId = model.ApproverId,
            };

            await this.approvalsService.AddAsync(approval);

            await this.approvalsService.SaveChangesAsync();

            return Ok();
        }
    }
}
