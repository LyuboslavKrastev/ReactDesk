using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
	[Authorize]
    [ApiController]
    public class StatusesController : ControllerBase
    {
		private readonly IUserService userService;
        private readonly StatusService statusService;

        public StatusesController(IUserService userService, StatusService statusService)
        {
            this.userService = userService;
            this.statusService = statusService;
        }

		[HttpGet("[action]")]
        public IActionResult GetAll()
        {
                var statuses = this.statusService.GetAll().ToArray();

            //var requestViewModels = Mapper.Map<RequestListingViewModel>(requests);
            return Ok(statuses);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var status = this.statusService.ById(id);
            //.Include(r => r.Notes).Include(r => r.AssignedTo).ToArray();
            //var requestViewModels = Mapper.Map<RequestListingViewModel>(requests);
            return Ok(status);
        }
    }
}