using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Data.Models.Requests;

namespace BasicDesk.Services.Interfaces
{
    public interface IApprovalsService : IDbService<RequestApproval>
    {
        Task Approve(int approvalId, string userId);
        Task Deny(int approvalId, string userId);
        IQueryable<RequestApproval> GetUserApprovalsToApprove(string userId);
        IQueryable<RequestApproval> GetUserSubmittedApprovals(string userId);
    }
}