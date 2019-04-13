using BasicDesk.Data;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BasicDesk.Services
{
    public class RoleService : IRoleService
    {
        private BasicDeskDbContext _context;

        public RoleService(BasicDeskDbContext context)
        {
            _context = context;
        }

        public Role Create(Role role)
        {
            _context.Roles.Add(role);
            _context.SaveChanges();
            return role;
        }

        public IEnumerable<Role> GetAll()
        {
            return _context.Roles;
        }

        public Role GetById(int id)
        {
            return _context.Roles.FirstOrDefault(r => r.Id == id);
        }
    }
}
