using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using BasicDesk.App.Models.Management.BindingModels;
using BasicDesk.App.Models.Common.ViewModels.Solutions;
using BasicDesk.Data.Models;
using BasicDesk.Data.Models.Solution;
using BasicDesk.Services;
using BasicDesk.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactDesk.Helpers.Interfaces;
using ReactDesk.BaseClasses;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
	[Authorize]
    [ApiController]
    public class SolutionsController : ControllerBaseWithDownloads<SolutionAttachment>
    {
        private readonly ISolutionsService solutionService;
        private readonly IFileUploader fileUploader;
        private readonly IUserIdentifier userIdentifier;

        public SolutionsController(ISolutionsService solutionService, 
            AttachmentsService<SolutionAttachment> attachmentService, 
            IFileUploader fileUploader, IUserIdentifier userIdentifier) : base(attachmentService)
        {
            this.solutionService = solutionService;
            this.fileUploader = fileUploader;
            this.userIdentifier = userIdentifier;
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
            User user = userIdentifier.Identify(User);

            if (user == null)
            {
                return BadRequest();
            }

            Solution solution = await this.solutionService.ByIdAndIncreaseViews(id);

            if (solution == null)
            {
                return NotFound();
            }

            SolutionDetailsViewModel model = Mapper.Map<SolutionDetailsViewModel>(solution);

            return Ok(model);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromForm]SolutionCreationBindingModel model)
        {
            User user = userIdentifier.Identify(User);

            if (user == null)
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