using System;
using Application.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Images
{
    public class ImageAccessor : IImageAccessor
    {
        private readonly Cloudinary _cloudinary;

        public ImageAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        public Application.Images.ImageUploadResult AddImage(IFormFile file)
        {
            var cloudinaryUploadResult = new CloudinaryDotNet.Actions.ImageUploadResult();

            if (file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams
                    {
                        File = new FileDescription(file.FileName, stream)
                    };

                    cloudinaryUploadResult = _cloudinary.Upload(uploadParams);
                }
            }

            if (cloudinaryUploadResult.Error != null)
            {
                throw new Exception(cloudinaryUploadResult.Error.Message);
            }

            return new Application.Images.ImageUploadResult()
            {
                PublicId = cloudinaryUploadResult.PublicId,
                Url = cloudinaryUploadResult.SecureUrl.AbsoluteUri
            };
        }

        public string DeleteImage(string publicId)
        {
            throw new System.NotImplementedException();
        }
    }
}