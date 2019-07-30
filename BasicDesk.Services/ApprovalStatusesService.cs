using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;

namespace BasicDesk.Services
{
    public class ApprovalStatusesService : BaseDbService<ApprovalStatus>, IApprovalStatusesService, IDbService<ApprovalStatus>
    {
        public ApprovalStatusesService(IRepository<ApprovalStatus> repository) : base(repository)
        {
        }
    }
}
