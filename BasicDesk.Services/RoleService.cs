using BasicDesk.Data;
using BasicDesk.Data.Models;
using BasicDesk.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace BasicDesk.Services
{
    public class RoleService : IRoleService
    {
        private BasicDeskDbContext context;

        public RoleService(BasicDeskDbContext context)
        {
            this.context = context;
        }

        public Role Create(Role role)
        {
            this.context.Roles.Add(role);
            this.context.SaveChanges();
            return role;
        }

        public IEnumerable<Role> GetAll()
        {
            return this.context.Roles;
        }

        public Role ById(int id)
        {
            return this.context.Roles.FirstOrDefault(r => r.Id == id);
        }
    }
}
