using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BasicDesk.Data.Models.Interfaces;
using BasicDesk.Data.Models.Requests;
using BasicDesk.Services;
using Microsoft.AspNetCore.Mvc;
using ReactDesk.Helpers;

namespace ReactDesk.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class ControllerBaseWithDownloads<T> : Controller
        where T : class, IEntity, IAttachment
    {
        protected readonly AttachmentService<T> attachmentService;

        protected ControllerBaseWithDownloads(AttachmentService<T> attachmentService)
        {
            this.attachmentService = attachmentService;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Download(string fileName, string filePath, string attachmentId)
        {          
            try
            {
                var memory = new MemoryStream();
                using (var stream = new FileStream(filePath, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;
                return File(memory, GetContentType(filePath), Path.GetFileName(filePath));
            }
            catch (IOException)
            {
                //Delete the attachment from the database attachments table, if it no longer exists in the attachments directory
                int id = int.Parse(attachmentId);
                T entity = this.attachmentService.ById(id).First();
                await this.attachmentService.Delete(entity.Id);
                return NotFound();
            }
           
        }

        private string GetContentType(string path)
        {
            var types = FileFormatValidator.GetMimeTypes();
            var ext = Path.GetExtension(path).ToLowerInvariant();
            return types[ext];
        }
    }
}