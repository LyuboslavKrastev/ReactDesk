using System.Collections.Generic;
using System.Linq;
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
using BasicDesk.App.Models.Common;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.Data.Models;
using System;
using ReactDesk.BaseClasses;

namespace ReactDesk.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBaseWithDownloads<RequestAttachment>
    {
        private readonly IRequestsService requestService;
        private readonly IFileUploader fileUploader;
        private readonly IUserIdentifier userIdentifier;

        public RequestsController(IRequestsService requestService, 
            IFileUploader fileUploader, 
            AttachmentsService<RequestAttachment> attachmentService, 
            IUserIdentifier userIdentifier) : base(attachmentService)
        {
            this.requestService = requestService;
            this.fileUploader = fileUploader;
            this.userIdentifier = userIdentifier;
        }

        [HttpGet("[action]")]
        public IActionResult GetAll([FromQuery]TableFilteringModel model)
        {
            User currentUser = userIdentifier.Identify(User);
            bool isTechnician = userIdentifier.IsTechnician(currentUser.RoleId);

            // Filter the requests, depending on the criteria in the model
            var requestQueryable = this.requestService.GetAll(currentUser.Id, isTechnician, model);

            // Needed for the calculation of the number of pages to be displayed
            int total = requestQueryable.Count();

            IEnumerable<RequestListingViewModel> requests = requestQueryable
                .ProjectTo<RequestListingViewModel>()
                .ToArray();

            return Ok(new { requests, total });
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {          
            try
            {
                User user = userIdentifier.Identify(User);
                if (user == null)
                {
                    return BadRequest();
                }
                bool isTechnician = userIdentifier.IsTechnician(user.RoleId);
                
                RequestDetailsViewModel request = this.requestService
                    .ById(id, user.Id, isTechnician)
                    .ProjectTo<RequestDetailsViewModel>()
                    .FirstOrDefault();

                return Ok(request);
            }
            catch (NullReferenceException)
            {
                return NotFound();
            }
            catch (Exception)
            {
                return BadRequest();
            }
        }

        [HttpPost]
        public async Task<IActionResult> PostAsync([FromForm]RequestCreationBindingModel model)
        {
            User user = userIdentifier.Identify(User);

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

            return this.Ok(new { id = request.Id, subject = request.Subject });
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Merge(IEnumerable<int> ids)
        {
            if (!ids.Any())
            {
                return BadRequest(new { error = "Please select request[s] for merging" });
            }

            try
            {
                // requests are merged to the lowest provided id
                User currentUser = userIdentifier.Identify(User);
                bool isTechnician = userIdentifier.IsTechnician(currentUser.RoleId);
                IEnumerable<int> requestIds = ids.OrderByDescending(i => i);
                await this.requestService.Merge(requestIds, currentUser.Id, isTechnician);

                string message = $"Successfully merged request[s] {string.Join(", ", ids)}";

                return this.Ok(new { message = message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch
            {
                // TODO: log information about the exception

                return BadRequest();
            }

        }

        [HttpPut]
        public async Task<IActionResult> PutAsync([FromForm]RequestEditingBindingModel model)
        {
            User currentUser = userIdentifier.Identify(User);
            bool isTechnician = userIdentifier.IsTechnician(currentUser.RoleId);
            if (!isTechnician)
            {
                return Unauthorized();
            }

            try
            {
                await requestService.UpdateRequestAsync(model);
                string message = $"Successfully updated request {model.Id}";

                return this.Ok(new { message = message });
            }
            catch
            {
                string message = $"Failed to update request";
                return BadRequest(new { message = message });
            }

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