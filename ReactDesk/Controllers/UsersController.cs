using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using BasicDesk.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReactDesk.Exceptions;
using ReactDesk.Helpers;
using BasicDesk.Services.Interfaces;
using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.App.Models.Management.ViewModels;
using BasicDesk.Common.Constants;
using System.Linq;

namespace ReactDesk.Controllers
{
    /* The "login" endpoint is used for logging in to the application and is publicly accessible, 
       the "get user by id" is restricted to authenticated users in any role, 
       however regular users can only access their own user record whereas admin users can access any user record. 
       The "get all users" endpoint is restricted to admin users only. */

    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;
        private readonly AppSettings _appSettings;

        public UsersController(
            IUserService userService,
            IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult Login(UserLoggingInModel model)
        {
            var user = _userService.Authenticate(model.Username, model.Password);

            if (user == null)
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }              

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            var role = user.Role; /*userRoleService.GetRoleByUserId(user.Id);*/

            // return basic user info (without password) and token to store client side
            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Token = tokenString,
                Role = role.Name,
            });
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult Register(UserRegisteringModel userDto)
        {
            // map dto to entity
            var user = Mapper.Map<User>(userDto);

            try
            {
                // save 
                _userService.Create(user, userDto.Password);
                return Ok(new { message = "Successfully registered user" });
            }
            catch (Exception ex)
            {
                // return error message if there was an exception
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("[action]")]
        public IActionResult GetAll()
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            User user = _userService.GetById(userId);

            if (user.RoleId!= WebConstants.AdminRoleId && user.RoleId != WebConstants.HelpdeskRoleId)
            {
                return Unauthorized();
            }

            IEnumerable<User> users = _userService.GetAll();
            IEnumerable<UserConciseViewModel> result = Mapper.Map<IEnumerable<UserConciseViewModel>>(users);

            return Ok(result);
        }

        [HttpGet("[action]")]
        public IActionResult GetAllTechnicians()
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            User user = _userService.GetById(userId);

            if (user.RoleId != WebConstants.AdminRoleId && user.RoleId!= WebConstants.HelpdeskRoleId)
            {
                return Unauthorized();
            }

            var users = _userService.GetAllTechnicians();
            var userDtos = Mapper.Map<IList<TechnicianSelectViewModel>>(users);
            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            var user = _userService.GetById(id);
            var userDto = Mapper.Map<UserDetailsViewModel>(user);
            return Ok(userDto);
        }

        //[HttpPut("{id}")]
        //public IActionResult Update(string id, [FromBody]UserDTO userDto)
        //{
        //    // map dto to entity and set id
        //    var user = Mapper.Map<User>(userDto);
        //    user.Id = id;

        //    try
        //    {
        //        // save 
        //        _userService.Update(user, userDto.Password);
        //        return Ok();
        //    }
        //    catch (AppException ex)
        //    {
        //        // return error message if there was an exception
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _userService.Delete(id);
            return Ok();
        }
    }

}