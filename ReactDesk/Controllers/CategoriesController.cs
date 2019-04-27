using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly ICategoriesService categoriesService;

        public CategoriesController(IUserService userService, ICategoriesService categoriesService)
        {
            this.userService = userService;
            this.categoriesService = categoriesService;
        }

        [HttpGet("[action]")]
        public IActionResult GetAll()
        {
            var categories = this.categoriesService.GetAll().ToArray();

            return Ok(categories);
        }
    }
}