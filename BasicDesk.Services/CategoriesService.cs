using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;

namespace BasicDesk.Services
{
    public class CategoriesService : BaseDbService<RequestCategory>, ICategoriesService, IDbService<RequestCategory>
    {
        public CategoriesService(IRepository<RequestCategory> repository) : base(repository)
        {
        }

        public async Task Edit(int id, string name)
        {
            var category = await this.repository.All().FirstAsync(c => c.Id == id);

            category.Name = name;

            await this.SaveChangesAsync();
        }
    }
}
