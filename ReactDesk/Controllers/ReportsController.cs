using BasicDesk.Services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ReportsService service;

        public ReportsController(ReportsService service)
        {
            this.service = service;
        }

        [HttpGet("[action]")]
        public IActionResult GetMyRequests()
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token

            var data = this.service.GetMyRequestsData(userId).ToArray();


            return Ok(data);
        }
    }
}
