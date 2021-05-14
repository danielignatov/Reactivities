using Application.Images;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IImageAccessor
    {
         ImageUploadResult AddImage(IFormFile file);

         string DeleteImage(string publicId);
    }
}