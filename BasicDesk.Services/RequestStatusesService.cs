using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;

namespace BasicDesk.Services
{
    public class RequestStatusesService : BaseDbService<RequestStatus>, IRequestStatusesService, 
        IDbService<RequestStatus>
    {
        public RequestStatusesService(IRepository<RequestStatus> repository) : base(repository)
        {
        }
    }
}
