using AutoMapper.QueryableExtensions;
using BasicDesk.App.Models.Common.ViewModels.Solutions;
using BasicDesk.Data.Models.Solution;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Services.BaseClasses;

namespace BasicDesk.Services
{
    public class SolutionsService : BaseDbService<Solution>, ISolutionsService, IDbService<Solution>
    {


        public SolutionsService(DbRepository<Solution> repository) : base(repository)
        {
        }


        public IQueryable<SolutionDetailsViewModel> GetSolutionDetails(int id)
        {
            IQueryable<SolutionDetailsViewModel> solution = this.ById(id).ProjectTo<SolutionDetailsViewModel>();

            return solution;
        }

        public async Task IncreaseViewCount(int solutionId)
        {
            Solution solution = this.ById(solutionId).FirstOrDefault();

            if (solution != null)
            {
                solution.Views++;
            }
            await this.SaveChangesAsync();
        } 
    }
}
