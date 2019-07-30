using BasicDesk.Data.Models.Interfaces;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Repository;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;

namespace BasicDesk.Services
{
    public class AttachmentsService<T> : BaseDbService<T>
        where T: class, IEntity, IAttachment 
    {
        public AttachmentsService(IRepository<T> repository) : base(repository)
        {
        }


    }
}
