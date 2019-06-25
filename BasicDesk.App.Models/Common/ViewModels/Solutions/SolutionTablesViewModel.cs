using System;
using System.Collections.Generic;
using System.Text;

namespace BasicDesk.App.Models.Common.ViewModels.Solutions
{
    public class SolutionTablesViewModel
    {
        public IEnumerable<SolutionListingViewModel> MostViewed { get; set; }

        public IEnumerable<SolutionListingViewModel> MostRecent { get; set; }
    }
}
