using AutoMapper.QueryableExtensions;
using BasicDesk.App.Models.Common;
using BasicDesk.App.Models.Common.ViewModels.Requests;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.App.Models.Management.ViewModels;
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

namespace BasicDesk.Services
{
    public class RequestService : BaseDbService<Request>, IRequestService, IDbService<Request>
    {
        private readonly ICategoriesService categoriesService;
        private readonly DbRepository<RequestStatus> statusRepository;
        private readonly IUserService userService;
        private readonly DbRepository<ApprovalStatus> approvalStatusRepository;

        public RequestService(IRepository<Request> repository, IUserService userService, ICategoriesService categoriesService,
            DbRepository<RequestStatus> statusRepository, DbRepository<ApprovalStatus> approvalStatusRepository) : base(repository)
        {
            this.categoriesService = categoriesService;
            this.userService = userService;
            this.statusRepository = statusRepository;
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
                RequestStatus status = await this.GetAllStatuses()
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
            await this.SaveChangesAsync();
        }

        public async Task SaveResolutionAsync(int id, string resolution)
        {
            Request request = await this.ById(id).FirstAsync();
            request.Resolution = resolution;
            await this.SaveChangesAsync();
        }

        public async Task AddNote(int requestId, string userId, string userName, bool isTechnician, string noteDescription)
        {
            Request request = await this.ById(requestId).FirstAsync();

            if (isTechnician || userId == request.RequesterId)
            {
                RequestNote note = new RequestNote
                {
                    RequestId = requestId,
                    Description = noteDescription,
                    CreationTime = DateTime.UtcNow,
                    Author = userName
                };

                request.Notes.Add(note);

                await this.SaveChangesAsync();
            }
        }

        public async Task AddReply(int requestId, string userId, bool isTechnician, string description)
        {
            Request request = await this.ById(requestId).FirstAsync();

            User author = this.userService.GetById(userId);

            if (isTechnician || userId == request.RequesterId)
            {

                RequestReply reply = new RequestReply
                {
                    Subject = $"Re: [{request.Subject}]",
                    RequestId = requestId,
                    Description = description,
                    CreationTime = DateTime.UtcNow,
                    Author = author
                };

                request.Repiles.Add(reply);

                await this.SaveChangesAsync();
            }
        }

        public async Task AddAproval(int requestId, string userId, bool isTechnician, string approverId, string subject, string description)
        {
            Request request = await this.repository.All().FirstOrDefaultAsync(r => r.Id == requestId);

            User author = this.userService.GetById(userId);

            if (isTechnician || userId == request.RequesterId)
            {
                ApprovalStatus pendingStatus = await this.approvalStatusRepository.All().FirstOrDefaultAsync(s => s.Name == "Pending");

                RequestApproval approval = new RequestApproval
                {
                    Subject = subject,
                    RequestId = requestId,
                    Description = description,
                    RequesterId = userId,
                    ApproverId = approverId,
                    StatusId = pendingStatus.Id
                };

                request.Approvals.Add(approval);

                await this.SaveChangesAsync();
            }
        }


        public async Task AddNote(IEnumerable<int> requestIds, string userId, string userName, bool isTechnician, string noteDescription)
        {
            foreach (var id in requestIds)
            {
                Request request = await this.repository.All().FirstOrDefaultAsync(r => r.Id == id);

                if (isTechnician || userId == request.RequesterId)
                {
                    RequestNote note = new RequestNote
                    {
                        RequestId = id,
                        Description = noteDescription,
                        CreationTime = DateTime.UtcNow,
                        Author = userName
                    };

                    request.Notes.Add(note);
                }
            }

            await this.SaveChangesAsync();
        }


        public IQueryable<RequestStatus> GetAllStatuses()
        {
            return this.statusRepository.All().AsNoTracking();
        }
    }
}
