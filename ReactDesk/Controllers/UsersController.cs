﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using BasicDesk.App.Models.DTOs;
using BasicDesk.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReactDesk.Exceptions;
using ReactDesk.Helpers;
using BasicDesk.Services.Interfaces;

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
        private readonly IUserRoleService userRoleService;
        private readonly AppSettings _appSettings;

        public UsersController(
            IUserService userService, IUserRoleService userRoleService,
            IOptions<AppSettings> appSettings)
        {
            _userService = userService;
            this.userRoleService = userRoleService;
            _appSettings = appSettings.Value;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult Login([FromBody]UserDTO userDto)
        {
            var user = _userService.Authenticate(userDto.Username, userDto.Password);

            if (user == null)
                return BadRequest(new { message = "Username or password is incorrect" });

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

            var role = userRoleService.GetRoleByUserId(user.Id);

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
        public IActionResult Register([FromBody]UserDTO userDto)
        {
            // map dto to entity
            var user = Mapper.Map<User>(userDto);

            try
            {
                // save 
                _userService.Create(user, userDto.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("[action]")]
        public IActionResult GetAll()
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            User user = _userService.GetById(userId);

            Role role = userRoleService.GetRoleByUserId(user.Id);

            if (role.Name != "Admin")
            {
                return Unauthorized();
            }

            var users = _userService.GetAll();
            var userDtos = Mapper.Map<IList<UserDTO>>(users);
            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(string id)
        {
            //const currentUser = users.find(x => x.role === role);
            //if (id !== currentUser.id && role !== Role.Admin) return unauthorised();
            var user = _userService.GetById(id);
            var userDto = Mapper.Map<UserDTO>(user);
            return Ok(userDto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(string id, [FromBody]UserDTO userDto)
        {
            // map dto to entity and set id
            var user = Mapper.Map<User>(userDto);
            user.Id = id;

            try
            {
                // save 
                _userService.Update(user, userDto.Password);
                return Ok();
            }
            catch (AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _userService.Delete(id);
            return Ok();
        }
    }

}