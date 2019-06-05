using System.Linq;
using System.Threading.Tasks;
using BasicDesk.App.Models.Common.ViewModels;
using BasicDesk.Data.Models.Solution;

namespace BasicDesk.Services.Interfaces
{
    public interface ISolutionService : IDbService<Solution>
    {
        IQueryable<SolutionDetailsViewModel> GetSolutionDetails(int id);
        Task IncreaseViewCount(int solutionId);
    }
}