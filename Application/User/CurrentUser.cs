using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.User
{
    public class CurrentUser
    {
        public class Query : IRequest<User>
        {

        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;
            private readonly IUserAccessor _userAccessor;

            public Handler(UserManager<AppUser> userManager,
            IJwtGenerator jwtGenerator,
            IUserAccessor userAccessor)
            {
                _userManager = userManager;
                _jwtGenerator = jwtGenerator;
                _userAccessor = userAccessor;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.Users
                .Include(x => x.Images)
                .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                return new User
                {
                    DisplayName = user.DisplayName,
                    Username = user.UserName,
                    Token = _jwtGenerator.CreateToken(user),
                    Image = user.Images.FirstOrDefault(x => x.IsMain)?.Url,
                    Locale = user.Locale
                };
            }
        }
    }
}