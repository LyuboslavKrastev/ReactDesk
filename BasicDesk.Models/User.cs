using BasicDesk.Common.Constants.Validation;
using BasicDesk.Data.Models.Requests;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BasicDesk.Data.Models
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public static string FindFirst(string name)
        {
            throw new NotImplementedException();
        }

        [Required]
        [MinLength(UserConstants.FullNameMinLength)]
        [MaxLength(UserConstants.FullNameMaxLength)]
        public string FullName { get; set; }

        [Required]
        [MinLength(UserConstants.UsernameMinLength)]
        [MaxLength(UserConstants.UsernameMaxLength)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        [MinLength(3)]
        [Display(Name = "Email")]
        public string Email { get; set; }

        [Required]
        public byte[] PasswordHash { get; set; }
        [Required]
        public byte[] PasswordSalt { get; set; }

        public bool IsBanned { get; set; } = false;

        public int RoleId { get; set; }
        public Role Role { get; set; }

        public ICollection<Request> Requests { get; set; } = new List<Request>();
    }
}
