using Microsoft.AspNetCore.Mvc.Rendering;
using System.Collections.Generic;

namespace BasicDesk.App.Models.Common.ViewModels.Requests
{
    public class ApprovalCreationViewModel
    {
        public int RequestId { get; set; }

        public string ApproverId { get; set; }

        public IEnumerable<SelectListItem> Users { get; set; }

        public string Subject { get; set; }

        public string Description { get; set; }
    }
}
