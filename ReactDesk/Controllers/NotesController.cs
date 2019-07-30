using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using ReactDesk.Helpers.Interfaces;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly IUserIdentifier userIdentifier;
        private readonly INotesService noteService;

        public NotesController(IRequestsService requestService, IUserIdentifier userIdentifier, INotesService noteService)
        {
            this.userIdentifier = userIdentifier;
            this.noteService = noteService;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]JObject data)
        {
            IEnumerable<int> ids = data["ids"].ToObject<int[]>();
            string description = data["description"].ToObject<string>();
            User user = userIdentifier.Identify(User);
            bool isTechnician = userIdentifier.IsTechnician(user.RoleId);

            if (user == null)
            {
                return BadRequest();
            }

            if (User == null)
            {
                return BadRequest();
            }

            await this.noteService.AddManyAsync(ids, user.Id, user.Username, isTechnician, description);


            return Ok("Note[s] added successfully");
        }
    }

}
