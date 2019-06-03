using System.ComponentModel.DataAnnotations;

namespace BasicDesk.App.Models.DTOs
{
    public class UserDTO
    {
            public string Id { get; set; }
            [Required]
            public string FullName { get; set; }
            [Required]
            public string Username { get; set; }
            [Required]
            public string Password { get; set; }

            [Required]
            [Compare(nameof(Password))]
            public string ConfirmPassword { get; set; }
            public string Token { get; set; }
        }
}
