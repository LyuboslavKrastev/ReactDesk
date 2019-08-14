using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Data.Models.Requests;

namespace BasicDesk.Services.Interfaces
{
    public interface IApprovalsService : IDbService<RequestApproval>
    {
        Task Update(int approvalId, string userId, bool isApproved);
        IQueryable<RequestApproval> GetUserApprovalsToApprove(string userId);
        IQueryable<RequestApproval> GetUserSubmittedApprovals(string userId);
    }
}