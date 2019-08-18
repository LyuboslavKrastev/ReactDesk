using AutoMapper.QueryableExtensions;
using BasicDesk.App.Models.Common.ViewModels.Solutions;
using BasicDesk.Data.Models.Solution;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Services.BaseClasses;
using System;
using Microsoft.EntityFrameworkCore;

namespace BasicDesk.Services
{
    public class SolutionsService : BaseDbService<Solution>, ISolutionsService, IDbService<Solution>
    {


        public SolutionsService(DbRepository<Solution> repository) : base(repository)
        {
        }

        public async Task<Solution> ByIdAndIncreaseViews(int id)
        {
            Solution solution = base.ById(id)
                .Include(s => s.Author)
                .FirstOrDefault();

            solution.Views++;

            await this.SaveChangesAsync();

            return solution;
        }
    }
}
