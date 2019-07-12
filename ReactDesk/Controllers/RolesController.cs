using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReactDesk.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly IUserService userService;

        public RolesController(IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPut]
        public IActionResult Put(RoleUpdatingBindingModel model)
        {
            string currentUserId = User.FindFirst(ClaimTypes.Name)?.Value;

            User user = this.userService.GetById(currentUserId);

            if(user.RoleId!= WebConstants.AdminRoleId)
            {
                return Unauthorized();
            }

            int roleId;

            if (model.RoleName == WebConstants.AdminRoleName)
            {
                roleId = WebConstants.AdminRoleId;
            }
            else if (model.RoleName == WebConstants.HelpdeskRoleName)
            {
                roleId = WebConstants.HelpdeskRoleId;
            }
            else if (model.RoleName == WebConstants.UserRoleName)
            {
                roleId = WebConstants.UserRoleId;
            }
            else
            {
                return BadRequest("Invalid role.");
            }                      

            try
            {
                this.userService.AddToRoleAsync(model.UserId, roleId);
                return Ok(new { message = "User roles updated successfully'." });
            }
            catch(Exception ex)
            {
                return BadRequest(new { message = "User roles could not be updated." });
            }




           
        }
    }
}
