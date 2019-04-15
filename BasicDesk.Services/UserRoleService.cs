using BasicDesk.Data;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BasicDesk.Services
{
    public class UserRoleService : IUserRoleService
    {
        private readonly BasicDeskDbContext _context;

        public UserRoleService(BasicDeskDbContext context)
        {
            this._context = context;
        }
        public Role GetRoleByUserId(string userId)
        {
            var userRole = _context.UserRoles.Where(ur => ur.UserId == userId).FirstOrDefault();
            var role = _context.Roles.FirstOrDefault(r => r.Id == userRole.RoleId);

            return role;
        }

        public User GetUserByRoleId(int roleId)
        {
            var userRole = _context.UserRoles.Where(ur => ur.RoleId == roleId).FirstOrDefault();
            var user = _context.Users.FirstOrDefault(r => r.Id == userRole.UserId);

            return user;
        }
    }
}
