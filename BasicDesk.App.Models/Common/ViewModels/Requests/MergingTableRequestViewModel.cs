using X.PagedList;

namespace BasicDesk.App.Models.Common.ViewModels.Requests
{
    public class MergingTableRequestViewModel
    {
        public int Id { get; set; }

        public IPagedList<RequestMergeListingViewModel> Requests { get; set; }
    }
}
