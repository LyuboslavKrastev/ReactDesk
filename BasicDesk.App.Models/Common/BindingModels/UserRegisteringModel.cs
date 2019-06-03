using BasicDesk.Common.Constants.Validation;
using System.ComponentModel.DataAnnotations;

namespace BasicDesk.App.Models.Common.BindingModels
{

    public class UserRegisteringModel
    {
        [Required]
        [MinLength(UserConstants.UsernameMinLength)]
        [MaxLength(UserConstants.UsernameMaxLength)]
        public string Username { get; set; }

        [Required]
        [MinLength(UserConstants.FullNameMinLength)]
        [MaxLength(UserConstants.FullNameMaxLength)]
        [Display(Name = "Full Name")]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        [MinLength(3)]
        [Display(Name = "Email")]
        public string Email { get; set; }
        
        [Required]
        [MinLength(UserConstants.PasswordMinLength)]
        [MaxLength(UserConstants.PasswordMaxLength)]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm password")]
        [MinLength(UserConstants.PasswordMinLength)]
        [MaxLength(UserConstants.PasswordMaxLength)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }
    }
}
