using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.App.Models.ViewModels;
using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Solution;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactDesk.Helpers.Interfaces;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
	[Authorize]
    [ApiController]
    public class SolutionsController : ControllerBase
    {
		private readonly IUserService userService;
        private readonly ISolutionService solutionService;
        private readonly AttachmentService<SolutionAttachment> attachmentService;
        private readonly IFileUploader fileUploader;

        public SolutionsController(IUserService userService, ISolutionService solutionService, 
            AttachmentService<SolutionAttachment> attachmentService, IFileUploader fileUploader)
        {
            this.userService = userService;
            this.solutionService = solutionService;
            this.attachmentService = attachmentService;
            this.fileUploader = fileUploader;
        }

		[HttpGet("[action]")]
        public IActionResult GetAll()
        {
            var solutions = this.solutionService.GetAll().ProjectTo<SolutionListingViewModel>().ToArray();

            return Ok(solutions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value; // gets the user id from the jwt token
            var solution = this.solutionService.GetSolutionDetails(id).FirstOrDefault();

            if (solution == null)
            {
                return NotFound();
            }

            await this.solutionService.IncreaseViewCount(solution.Id);

            return Ok(solution);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm]SolutionCreationBindingModel model)
        {
            string userId = User.FindFirst(ClaimTypes.Name)?.Value;
            User user = this.userService.GetById(userId);
            if(user == null)
            {
                return BadRequest();
            }

            var solution = Mapper.Map<Solution>(model);
            solution.AuthorId = user.Id;


            await this.solutionService.AddAsync(solution);

            if (model.Attachments != null)
            {
                string path = await fileUploader.CreateAttachmentAsync(solution.Title, model.Attachments, "Solutions");

                ICollection<SolutionAttachment> attachments = new List<SolutionAttachment>();

                foreach (var attachment in model.Attachments)
                {
                    SolutionAttachment solutionAttachment = new SolutionAttachment
                    {
                        FileName = attachment.FileName,
                        PathToFile = Path.Combine(path, attachment.FileName),
                        SolutionId = solution.Id
                    };
                    attachments.Add(solutionAttachment);
                }

                await this.attachmentService.AddRangeAsync(attachments);
            }

            await this.solutionService.SaveChangesAsync();

            return Ok(new { solution.Id, solution.Title});
        }
    }
}