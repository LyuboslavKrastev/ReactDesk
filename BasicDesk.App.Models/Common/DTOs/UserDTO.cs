using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BasicDesk.App.Models.DTOs
{
    public class UserDTO
    {
            public string Id { get; set; }
            public string FullName { get; set; }
            public string Username { get; set; }
            public string Password { get; set; }
            public string Token { get; set; }
    }
}
