using Microsoft.AspNetCore.Mvc;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {

        [HttpGet("[action]")]
        public IActionResult GetAll()
        {
            

            return Ok();
        }
    }
}
