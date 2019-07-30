using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;

namespace BasicDesk.Services
{
    public class ApprovalsService : BaseDbService<RequestApproval>, IApprovalsService, IDbService<RequestApproval>
    {
        private readonly IRequestsService requestService;
        private readonly IApprovalStatusesService approvalsStatusService;

        public ApprovalsService(IRepository<RequestApproval> repository,
            IRequestsService requestService, IApprovalStatusesService approvalsStatusService) : base(repository)
        {
            this.requestService = requestService;
            this.approvalsStatusService = approvalsStatusService;
        }

        public IQueryable<RequestApproval> GetUserSubmittedApprovals(string userId)
        {
            var approvals = this.GetAll().Where(ap => ap.RequesterId == userId && ap.Status.Name == "Pending");
            return approvals;
        }

        public IQueryable<RequestApproval> GetUserApprovalsToApprove(string userId)
        {
            var approvals = this.GetAll().Where(ap => ap.ApproverId == userId && ap.Status.Name == "Pending");
            return approvals;
        }

        public async Task Approve(int approvalId, string userId)
        {
            RequestApproval approval = await this.repository.All().FirstOrDefaultAsync(ra => ra.Id == approvalId && ra.Status.Name == "Pending");

            if (approval != null)
            {
                if (approval.ApproverId == userId)
                {
                    ApprovalStatus status = await this.approvalsStatusService.GetAll().FirstOrDefaultAsync(s => s.Name == "Approved");
                    if (status != null)
                    {
                        approval.StatusId = status.Id;
                        await this.SaveChangesAsync();
                    }
                }
            }
        }

        public async Task AddAsync(int requestId, string userId, bool isTechnician, string approverId, string subject, string description)
        {
            Request request = await this.requestService.ById(requestId).FirstOrDefaultAsync();

            if (isTechnician || userId == request.RequesterId)
            {
                ApprovalStatus pendingStatus = await this.approvalsStatusService.GetAll()
                    .FirstOrDefaultAsync(s => s.Name == "Pending");

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


        public async Task Deny(int approvalId, string userId)
        {
            RequestApproval approval = await this.repository.All().FirstOrDefaultAsync(ra => ra.Id == approvalId);

            if (approval.ApproverId != userId)
            {
                throw new InvalidOperationException("You are not authorized to approve this");
            }

            ApprovalStatus status = await this.approvalsStatusService
                .GetAll()
                .FirstOrDefaultAsync(s => s.Name == "Denied");

            if (status == null)
            {
                throw new ArgumentException("Invalid status");
            }

            approval.StatusId = status.Id;
            await this.SaveChangesAsync();
        }

    }
}
