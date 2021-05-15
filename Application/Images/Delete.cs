using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
    public class Delete
    {
        public class Command : IRequest
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            private readonly IImageAccessor _imageAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IImageAccessor imageAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
                _imageAccessor = imageAccessor;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(x => x.Images).SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                var image = user.Images.FirstOrDefault(x => x.Id == request.Id);

                if (image == null)
                    throw new RestException(HttpStatusCode.NotFound, new { Image = "Not found" });

                if (image.IsMain)
                    throw new RestException(HttpStatusCode.BadRequest, new { Image = "You cannot delete your main image" });

                var result = _imageAccessor.DeleteImage(request.Id);

                if (result == null)
                    throw new Exception("Problem deleting the image");

                var success = await _context.SaveChangesAsync() > 0;

                user.Images.Remove(image);

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}