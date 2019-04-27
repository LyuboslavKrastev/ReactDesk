using BasicDesk.Common.Constants.Validation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BasicDesk.App.Models.Common.BindingModels
{
    public class RequestCreationBindingModel
    {
        [Required]
        [MinLength(RequestConstants.SubjectMinLength)]
        [MaxLength(RequestConstants.SubjectMaxLength)]
        public string Subject { get; set; }

        [Required]
        [MinLength(RequestConstants.DescriptionMinLength)]
        [MaxLength(RequestConstants.DescriptionMaxLength)]
        public string Description { get; set; }

        public DateTime StartTime { get; set; } = DateTime.Now;

        public int CategoryId { get; set; }

        [DataType(DataType.Upload)]
        public ICollection<IFormFile> Attachments { get; set; }
    }
}
