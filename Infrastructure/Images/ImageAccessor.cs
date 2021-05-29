using System;
using Application.Enums;
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
                        File = new FileDescription(file.FileName, stream),
                        Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face")
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

        public ImageDeleteResult DeleteImage(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);

            var result = _cloudinary.Destroy(deleteParams);

            switch (result.Result)
            {
                case "ok":
                    return ImageDeleteResult.Ok;
                case "not found":
                    return ImageDeleteResult.NotFound;
                default:
                    return ImageDeleteResult.Error;
            }
        }
    }
}