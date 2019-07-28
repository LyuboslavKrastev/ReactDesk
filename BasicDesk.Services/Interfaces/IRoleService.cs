using BasicDesk.Data.Models;
using System.Collections.Generic;

namespace BasicDesk.Services.Interfaces
{
    public interface IRoleService
    {
        IEnumerable<Role> GetAll();
        Role ById(int id);
        Role Create(Role role);
    }
}
