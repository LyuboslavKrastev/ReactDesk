using BasicDesk.Data.Models.Requests;
using BasicDesk.Services.Interfaces;
using BasicDesk.Services.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Services.BaseClasses;
using BasicDesk.Services.Repository.Interfaces;
using BasicDesk.Common.Constants;

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


        public async Task Update(int approvalId, string userId, bool isApproved)
        {
            RequestApproval approval = await this.ById(approvalId).FirstOrDefaultAsync();

            if (approval == null)
            {
                throw new ArgumentException("Invalid approval id");
            }

            if (approval.ApproverId != userId)
            {
                throw new InvalidOperationException("You are not authorized to approve this");
            }


            int statusId = isApproved ? WebConstants.ApprovedApprovalStatusId :
                WebConstants.DeniedApprovalStatusId;

            approval.StatusId = statusId;
            await this.SaveChangesAsync();
        }

    }
}
