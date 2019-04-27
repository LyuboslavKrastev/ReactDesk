using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
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
    public class SolutionsController : ControllerBase
    {
		private readonly IUserService userService;
        private readonly ISolutionService solutionService;

        public SolutionsController(IUserService userService, ISolutionService solutionService)
        {
            this.userService = userService;
            this.solutionService = solutionService;
        }

		[HttpGet("[action]")]
        public IActionResult GetAll()
        {
                var solutions = this.solutionService.GetAll().Include(s => s.Author).ToArray();

            //var requestViewModels = Mapper.Map<RequestListingViewModel>(requests);
            return Ok(solutions);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var solution = this.solutionService.GetSolutionDetails(id);
            //.Include(r => r.Notes).Include(r => r.AssignedTo).ToArray();
            //var requestViewModels = Mapper.Map<RequestListingViewModel>(requests);
            return Ok(solution);
        }
    }
}