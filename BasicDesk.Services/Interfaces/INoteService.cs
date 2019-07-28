using BasicDesk.Data.Models.Requests;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BasicDesk.Services.Interfaces
{
    public interface INoteService : IDbService<RequestNote>
    {
        Task AddNote(IEnumerable<int> requestIds, string userId, string userName, bool isTechnician, string noteDescription);
        Task AddNote(int requestId, string userId, string userName, bool isTechnician, string noteDescription);
    }
}
