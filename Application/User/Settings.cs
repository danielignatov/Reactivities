using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.User
{
    public class Settings
    {
        public class Query : IRequest<User>
        {
            public string Locale { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly IUserAccessor _userAccessor;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(
                UserManager<AppUser> userManager,
                IUserAccessor userAccessor,
                IJwtGenerator jwtGenerator)
            {
                _userManager = userManager;
                _userAccessor = userAccessor;
                _jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetCurrentUserAsync();

                if (user == null)
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);

                user.Locale = request.Locale;
                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return new User
                    {
                        Username = user.UserName,
                        Token = _jwtGenerator.CreateToken(user),
                        DisplayName = user.DisplayName,
                        Image = user?.Images.FirstOrDefault(x => x.IsMain)?.Url,
                        Locale = user.Locale
                    };
                }

                throw new RestException(System.Net.HttpStatusCode.InternalServerError, "Error saving settings");
            }
        }
    }
}