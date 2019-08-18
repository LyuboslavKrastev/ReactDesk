using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Data.Models.Solution;

namespace BasicDesk.Services.Interfaces
{
    public interface ISolutionsService : IDbService<Solution>
    {
        Task<Solution> ByIdAndIncreaseViews(int id);
    }
}