using BasicDesk.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BasicDesk.Services.Interfaces
{
    public interface IRoleService
    {
        IEnumerable<Role> GetAll();
        Role GetById(int id);
        Role Create(Role role);
    }
}
