using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using BasicDesk.Services.Interfaces;
using BasicDesk.Data.Models.Requests;
using System.Threading.Tasks;
using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.App.Models.Common.ViewModels.Requests;
using AutoMapper.QueryableExtensions;
using ReactDesk.Helpers.Interfaces;
using System.IO;
using BasicDesk.Services;
using ReactDesk.Helpers;
using BasicDesk.App.Models.Common;
using System;

namespace ReactDesk.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBaseWithDownloads<RequestAttachment>
    {
        private readonly IUserService userService;
        private readonly IRequestService requestService;
        private readonly IFileUploader fileUploader;

        public RequestsController(IUserService userService, IRequestService requestService,IFileUploader fileUploader, 
            AttachmentService<RequestAttachment> attachmentService) : base(attachmentService)
        {

                this.userService = userService;
                this.requestService = requestService;
                this.fileUploader = fileUploader;
        }

        [HttpGet("[action]")]
        public IActionResult GetAll([FromQuery]TableFilteringModel model)
        {
            var requests = this.requestService.GetAll()
                .Where(r => model.HasStatusIdFilter() ? 
                    r.StatusId == model.StatusId : true)
                .Where(r => model.HasIdFilter() ? 
                    r.Id == model.IdSearch : true)
                .Where(r => model.HasSubjectFilter() ? 
                    r.Subject.Contains(model.SubjectSearch) : true)
                .Where(r => model.HasRequesterFilter() ?
                    r.Requester.FullName == model.RequesterSearch : true)
                .Where(r => model.HasAssignedToFilter() ?
                    r.AssignedTo.FullName == model.AssignedToSearch : true)
                .Where(r => model.HasValidStartTimeFilter() ? 
                    r.StartTime.Date.CompareTo(model.GetStartTimeAsDateTime()) == 0 : true)
                .Where(r => model.HasValidEndTimeFilter()  && r.EndTime.HasValue ? 
                    r.EndTime.Value.Date.CompareTo(model.GetEndTimeAsDateTime()) == 0 : true)
                .ProjectTo<RequestListingViewModel>()
                .OrderByDescending(r => r.Id)
                .ToArray();
           
            return Ok(requests.ToArray());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
           string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var request = this.requestService.GetRequestDetails(id, userId).FirstOrDefault();
            if (request == null)
            {
                return NotFound();
            }
            return Ok(request);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm]RequestCreationBindingModel model)
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var user = userService.GetById(userId);

            if (user == null)
            {
                return BadRequest();
            }

            var request = Mapper.Map<Request>(model);     

            request.RequesterId = user.Id;

            await this.requestService.AddAsync(request);

            if (model.Attachments != null)
            {
                string path = await fileUploader.CreateAttachmentAsync(model.Subject, model.Attachments, "Requests");

                ICollection<RequestAttachment> attachments = new List<RequestAttachment>();

                foreach (var attachment in model.Attachments)
                {
                    RequestAttachment requestAttachment = new RequestAttachment
                    {
                        FileName = attachment.FileName,
                        PathToFile = Path.Combine(path, attachment.FileName),
                        RequestId = request.Id
                    };
                    attachments.Add(requestAttachment);
                }

                await this.attachmentService.AddRangeAsync(attachments);
            }

            await this.requestService.SaveChangesAsync();

            return this.Ok(request);
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Merge(IEnumerable<int> ids)
        {
            if (!ids.Any())
            {
                return BadRequest(new { error = "Please select request[s] for merging" });
            }

            //ids are merged from highest to lowest
            IEnumerable<int> requestIds = ids.OrderByDescending(i => i);

            await this.requestService.Merge(requestIds);
            await this.requestService.DeleteRange(requestIds.SkipLast(1));
            string message = $"Successfully merged request[s] {string.Join(", ", ids)}";

            return this.Ok(new { message = message });
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(IEnumerable<int> ids)
        {
            if (!ids.Any())
            {
                return BadRequest(new { error = "Please select request[s] for deletion" });
            }

            await this.requestService.DeleteRange(ids);
            string message = $"Successfully deleted request[s] {string.Join(", ", ids)}";

            return this.Ok(new { message = message });
        }
    }
}