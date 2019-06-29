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

namespace ReactDesk.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IRequestService requestService;
        private readonly IFileUploader fileUploader;
        private readonly AttachmentService<RequestAttachment> attachmentService;

        public RequestsController(IUserService userService, IRequestService requestService, 
            IFileUploader fileUploader, AttachmentService<RequestAttachment> attachmentService)
        {
            this.userService = userService;
            this.requestService = requestService;
            this.fileUploader = fileUploader;
            this.attachmentService = attachmentService;
        }

        [HttpGet("[action]")]
        public IActionResult GetAll(int? statusId)
        {
            //var requests = this.requestService.GetAll().Include(r => r.Requester)
            //.Include(r => r.Notes).Include(r => r.Status)
            //.Where(r => statusId.HasValue ? r.StatusId == statusId : true).Include(r => r.AssignedTo).ToArray();


            var requests = this.requestService.GetAll()
                .Where(r => statusId.HasValue ? r.StatusId == statusId : true)             
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

        // WARNING: NOT SECURE (No validation)!
        [HttpGet("[action]")]
        public async Task<IActionResult> Download(string fileName, string filePath, string attachmentId)
        {
            var memory = new MemoryStream();
            try
            {
                using (var stream = new FileStream(filePath, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
            }
            // Delete the attachment from the database attachments table, if it no longer exists in the attachments directory
            catch (IOException)
            {       
                // Check if the attachmentId is an integer
                if (int.TryParse(attachmentId, out int id))
                {
                    var entity = this.attachmentService.ById(id).First();
                    await this.attachmentService.Delete(entity.Id);        
                }

                return NotFound();
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), Path.GetFileName(filePath));
        }

        private string GetContentType(string path)
        {
            var types = FileFormatValidator.GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }
    }
}