using BasicDesk.Data.Models.Requests;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BasicDesk.Data.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string FirstName { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string LastName { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Username { get; set; }

        [Required]
        public byte[] PasswordHash { get; set; }
        [Required]
        public byte[] PasswordSalt { get; set; }

        public ICollection<Request> Requests { get; set; }

        public IEnumerable<UserRole> Roles { get; set; }
    }
}
