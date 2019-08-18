using BasicDesk.App.Models.Common;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.Common.Constants;
using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;

namespace BasicDesk.Services
{
    public class RequestsService : BaseDbService<Request>, IRequestsService, IDbService<Request>
    {
        private readonly ICategoriesService categoriesService;
        private readonly IRequestStatusesService statusService;
        private readonly IUsersService userService;
        private readonly DbRepository<ApprovalStatus> approvalStatusRepository;

        public RequestsService(IRepository<Request> repository, IUsersService userService, ICategoriesService categoriesService,
            IRequestStatusesService statusService, DbRepository<ApprovalStatus> approvalStatusRepository) : base(repository)
        {
            this.categoriesService = categoriesService;
            this.statusService = statusService;
            this.userService = userService;
            this.approvalStatusRepository = approvalStatusRepository;
        }

        public async Task Merge(IEnumerable<int> requestIds, string userId, bool isTechnian)
        {
            //Requests shall be merged to the lowest possible Id in the collection
            if (requestIds.Count() < 2)
            {
                throw new InvalidOperationException("At least two ids are needed in order to merge.");
            }

            // if the database does not contain one of the provied ids, throw exception
            if (requestIds.Any(r => !this.repository.All().Select(req => req.Id).Contains(r)))
            {
                throw new ArgumentException("Invalid request id has been provided.");
            }

            IEnumerable<int> ids = requestIds.SkipLast(1).ToList();
            int lastId = requestIds.Last();

            Request requestToMergeTo = await this.repository.All().FirstOrDefaultAsync(r => r.Id == lastId);
            if (!isTechnian && requestToMergeTo.RequesterId != userId)
            {
                throw new InvalidOperationException("A user can only merge his own requests!");
            }

            foreach (var id in ids)
            {
                Request request = await this.repository.All()
                    .Include(r => r.Attachments)
                    .FirstOrDefaultAsync(r => r.Id == id);

                if (!isTechnian && request.RequesterId != userId)
                {
                    throw new InvalidOperationException("A user can only merge his own requests!");
                }

                RequestReply reply = new RequestReply
                {
                    RequestId = request.Id,
                    AuthorId = request.RequesterId,
                    Subject = request.Subject,
                    Description = request.Description,
                };

                foreach (var attachment in request.Attachments)
                {
                    reply.Attachments.Add(new ReplyAttachment
                    {
                        PathToFile = attachment.PathToFile,
                        FileName = attachment.FileName
                    });
                }

                requestToMergeTo.Repiles.Add(reply);
            }

            await this.DeleteRange(ids);

            await this.SaveChangesAsync();
        }

        public IQueryable<Request> GetAll(string currentUserId, bool isTechnician, TableFilteringModel model)
        {
            // Filter the requests, depending on the criteria in the model
            IQueryable<Request> result = base.GetAll()
                .Where(r => isTechnician ? true : r.RequesterId == currentUserId)
                .Where(r => model.HasStatusIdFilter() ?
                    r.StatusId == model.StatusId : true)
                .Where(r => model.HasIdFilter() ?
                    r.Id == model.IdSearch : true)
                .Where(r => model.HasSubjectFilter() ?
                    r.Subject.Contains(model.SubjectSearch) : true)
                .Where(r => model.HasRequesterFilter() ?
                    r.Requester.FullName.Contains(model.RequesterSearch) : true)
                .Where(r => model.HasAssignedToFilter() ?
                    r.AssignedTo.FullName == model.AssignedToSearch : true)
                .Where(r => model.HasValidStartTimeFilter() ?
                    r.StartTime.Date.CompareTo(model.GetStartTimeAsDateTime()) == 0 : true)
                .Where(r => model.HasValidEndTimeFilter() && r.EndTime.HasValue ?
                    r.EndTime.Value.Date.CompareTo(model.GetEndTimeAsDateTime()) == 0 : true)
                .OrderByDescending(r => r.Id)
                .Skip(model.Offset)
                .Take(model.PerPage); // The default value is 50;

            return result;
        }

        public override IQueryable<Request> ById(int id, string userId, bool isTechnician)
        {
            if (!isTechnician)
            {
                return base.ById(id)
                    .Where(r => r.RequesterId == userId);
            }

            return base.ById(id);
        }

        public async Task UpdateRequestAsync(RequestEditingBindingModel model)
        {
            Request request = await this.repository
                .All()
                .FirstOrDefaultAsync(r => r.Id == model.Id);

            if (request == null)
            {
                throw new ArgumentException("Invalid request!");
            }

            if (model.StatusId != null && model.StatusId != request.StatusId)
            {
                RequestStatus status = await this.statusService.GetAll()
                    .FirstOrDefaultAsync(s => s.Id == model.StatusId);

                if (status == null)
                {
                    throw new ArgumentException("Invalid status!");
                }

                request.StatusId = status.Id;

                if (status.Id == WebConstants.ClosedStatusId || status.Id == WebConstants.RejectedStatusId)
                {
                    request.EndTime = DateTime.UtcNow;
                }
            }

            if (model.CategoryId != null && model.CategoryId != request.CategoryId)
            {
                RequestCategory category = await this.categoriesService.ById(Convert.ToInt32(model.CategoryId)).FirstOrDefaultAsync();

                if (category == null)
                {
                    throw new ArgumentException("Invalid category!");
                }

                request.CategoryId = category.Id;
            }

            if (model.AssignToId != null && model.AssignToId != request.AssignedToId)
            {
                User technician = this.userService.GetById(model.AssignToId);
                if (technician == null || technician.RoleId == WebConstants.UserRoleId)
                {
                    throw new ArgumentException("Invalid technician!");
                }

                 request.AssignedToId = technician.Id;
            }
            if (model.Resolution != request.Resolution)
            {
                request.Resolution = model.Resolution;
            }
            await this.SaveChangesAsync();
        }
    }
}
