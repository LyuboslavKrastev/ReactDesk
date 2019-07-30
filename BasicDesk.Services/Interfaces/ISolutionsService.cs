using System.Linq;
using System.Threading.Tasks;
using BasicDesk.App.Models.Common.ViewModels.Solutions;
using BasicDesk.Data.Models.Solution;

namespace BasicDesk.Services.Interfaces
{
    public interface ISolutionsService : IDbService<Solution>
    {
        IQueryable<SolutionDetailsViewModel> GetSolutionDetails(int id);
        Task IncreaseViewCount(int solutionId);
    }
}