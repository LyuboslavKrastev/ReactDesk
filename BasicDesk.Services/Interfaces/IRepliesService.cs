using BasicDesk.Data.Models.Requests;
using System.Threading.Tasks;

namespace BasicDesk.Services.Interfaces
{
    public interface IRepliesService : IDbService<RequestReply>
    {
        Task AddAsync(int requestId, string userId, bool isTechnician, string description);
    }
}
