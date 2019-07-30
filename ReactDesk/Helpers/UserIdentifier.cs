using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using ReactDesk.Helpers.Interfaces;
using System;
using System.Security.Claims;

namespace ReactDesk.Helpers
{
    public class UserIdentifier : IUserIdentifier
    {
        private readonly IUsersService userService;

        public UserIdentifier(IUsersService userService)
        {
            this.userService = userService;
        }

        public User Identify(ClaimsPrincipal userClaimsPrincipal)
        {
            string userId = userClaimsPrincipal.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            User user = userService.GetById(userId);
            return user;
        }

        public bool IsTechnician(int roleId)
        {
            return roleId == WebConstants.AdminRoleId || roleId == WebConstants.HelpdeskRoleId;
        }
    }
}
