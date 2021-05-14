using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
    public class Add
    {
        public class Command : IRequest<Image>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Image>
        {
            private readonly DataContext _context;

            private readonly IUserAccessor _userAccessor;

            private readonly IImageAccessor _imageAccessor;

            public Handler(
                DataContext context, 
                IUserAccessor userAccessor, 
                IImageAccessor imageAccessor)
            {
                _context = context;
                _imageAccessor = imageAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Image> Handle(Command request, CancellationToken cancellationToken)
            {
                var imageUploadResult = _imageAccessor.AddImage(request.File);

                var user = await _context.Users
                .Include(x => x.Images)
                .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var image = new Image
                {
                    Url = imageUploadResult.Url,
                    Id = imageUploadResult.PublicId
                };

                if (!user.Images.Any(x => x.IsMain))
                {
                    image.IsMain = true;
                }

                user.Images.Add(image);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return image;

                throw new Exception("Problem saving changes");
            }
        }
    }
}