using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.App.Models.Common;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.Data.Models.Requests;

namespace BasicDesk.Services.Interfaces
{
    public interface IRequestsService : IDbService<Request>
    {
        IQueryable<Request> GetAll(string currentUserId, bool isTechnician, TableFilteringModel model);
        IQueryable<Request> ById(int id, string userId, bool isTechnician);
        //Task AddAproval(int requestId, string userId, bool isTechnician, string approverId, string subject, string description); // to be extracted
        Task Merge(IEnumerable<int> requestIds, string userId, bool isTechnician );
        Task UpdateRequestAsync(RequestEditingBindingModel model);
    }
}