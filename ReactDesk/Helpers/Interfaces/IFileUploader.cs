using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ReactDesk.Helpers.Interfaces
{
    public interface IFileUploader
    {
        Task<string> CreateAttachmentAsync(string subject, IEnumerable<IFormFile> attachments, string folder);
    }
}