using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly IRequestService requestService;
        private readonly IUserService userService;

        public NotesController(IRequestService requestService, IUserService userService)
        {
            this.requestService = requestService;
            this.userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]JObject data)
        {
            var idss = data["ids"];
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            IEnumerable<int> ids = data["ids"].ToObject<int[]>();
            string description = data["description"].ToObject<string>();
            User user = this.userService.GetById(userId);

            if (User == null)
            {
                return BadRequest();
            }

            bool isTechnician = user.RoleId == WebConstants.AdminRoleId || user.RoleId == WebConstants.HelpdeskRoleId;

            await this.requestService.AddNote(ids, userId, user.Username, isTechnician, description);


            return Ok("Note[s] added successfully");
        }
    }

}
