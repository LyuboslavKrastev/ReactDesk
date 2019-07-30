using BasicDesk.Data.Models.Requests;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BasicDesk.Services.Interfaces
{
    public interface INotesService : IDbService<RequestNote>
    {
        Task AddManyAsync(IEnumerable<int> requestIds, string userId, string userName, bool isTechnician, string noteDescription);
    }
}
