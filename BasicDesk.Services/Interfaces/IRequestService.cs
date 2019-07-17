using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.App.Models.Common;
using BasicDesk.App.Models.Common.ViewModels.Requests;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.App.Models.Management.ViewModels;
using BasicDesk.Data.Models.Requests;

namespace BasicDesk.Services.Interfaces
{
    public interface IRequestService : IDbService<Request>
    {
        IQueryable<Request> GetAll(string currentUserId, bool isTechnician, TableFilteringModel model);
        Task AddAproval(int requestId, string userId, bool isTechnician, string approverId, string subject, string description);
        Task AddNote(IEnumerable<int> requestIds, string userId, string userName, bool isTechnician, string noteDescription);
        Task AddNote(int requestId, string userId, string userName, bool isTechnician, string noteDescription);
        Task AddReply(int requestId, string userId, bool isTechnician, string noteDescription);
        IQueryable<RequestStatus> GetAllStatuses();
        IQueryable<RequestDetailsViewModel> GetRequestDetails(int id, string userId);
        IQueryable<RequestManagingModel> GetRequestManagingDetails(int id);
        Task Merge(IEnumerable<int> requestIds);
        Task SaveResolutionAsync(int id, string resolution);
        Task UpdateRequestAsync(RequestEditingBindingModel model);
    }
}