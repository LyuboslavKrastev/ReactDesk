using System;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;

namespace BasicDesk.Services
{
    public class RepliesService : BaseDbService<RequestReply>, IRepliesService, IDbService<RequestReply>
    {
        private readonly IRequestsService requestService;

        public RepliesService(IRepository<RequestReply> repository, IRequestsService requestService) : base(repository)
        {
            this.requestService = requestService;
        }

        public async Task AddAsync(int requestId, string userId, bool isTechnician, string description)
        {
            Request request = this.requestService.ById(requestId).FirstOrDefault();

            if (request == null)
            {
                throw new ArgumentException("Invalid request id");
            }

            if (!isTechnician && userId != request.RequesterId)
            {
                throw new InvalidOperationException("Users can only add replies to their own requests");
            }

            RequestReply reply = new RequestReply
            {
                Subject = $"Re: [{request.Subject}]",
                RequestId = requestId,
                Description = description,
                CreationTime = DateTime.UtcNow,
                AuthorId = userId
            };

            await base.AddAsync(reply);

            await base.SaveChangesAsync();
        }
    }
}
