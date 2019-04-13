using BasicDesk.Data.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace BasicDesk.Services.Interfaces
{
    public interface IUserRoleService
    {
        Role GetRoleByUserId(int id);
        User GetUserByRoleId(int id);
    }
}
