using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using BasicDesk.App.Models.DTOs;
using BasicDesk.Data.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ReactDesk.Exceptions;
using ReactDesk.Helpers;
using BasicDesk.Services.Interfaces;
using BasicDesk.Data.Models.Requests;
using System.IO;
using System.Threading.Tasks;
using BasicDesk.App.Models.Common.BindingModels;
using BasicDesk.App.Models.Common.ViewModels;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

namespace ReactDesk.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class RequestsController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IRequestService requestService;

        public RequestsController(IUserService userService, IRequestService requestService)
        {
            this.userService = userService;
            this.requestService = requestService;
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
                .ToArray();

            return Ok(requests.ToArray());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var request = this.requestService.GetRequestDetails(id, userId).Include(r => r.Author);
            //.Include(r => r.Notes).Include(r => r.AssignedTo).ToArray();
            //var requestViewModels = Mapper.Map<RequestListingViewModel>(requests);
            return Ok(request);
        }


        [HttpPost]
        public async Task<IActionResult> Post(RequestCreationBindingModel model)
        {
            var request = Mapper.Map<Request>(model);
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            request.RequesterId = userId;

            await this.requestService.AddAsync(request);

            //if (model.Attachments != null)
            //{
            //    string path = await fileUploader.CreateAttachmentAsync(model.Subject, model.Attachments, "Requests");

            //    ICollection<RequestAttachment> attachments = new List<RequestAttachment>();

            //    foreach (var attachment in model.Attachments)
            //    {
            //        RequestAttachment requestAttachment = new RequestAttachment
            //        {
            //            FileName = attachment.FileName,
            //            PathToFile = Path.Combine(path, attachment.FileName),
            //            RequestId = request.Id
            //        };
            //        attachments.Add(requestAttachment);
            //    }

            //    await this.attachmentService.AddRangeAsync(attachments);
            //}

            await this.requestService.SaveChangesAsync();

            //this.alerter.AddMessage(MessageType.Success, "Request created successfully");

            return this.Ok(request);
        }
    }
}
