using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace Application.User
{
    public class Login
    {
        public class Query : IRequest<User>
        {
            public string Email { get; set; }

            public string Password { get; set; }
        }

        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            private readonly IJwtGenerator _jwtGenerator;

            public Handler(
                UserManager<AppUser> userManager,
                SignInManager<AppUser> signInManager,
                IJwtGenerator jwtGenerator)
            {
                this._userManager = userManager;
                this._signInManager = signInManager;
                this._jwtGenerator = jwtGenerator;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.Users
                .Include(x => x.Images)
                .SingleOrDefaultAsync(x => x.NormalizedEmail == request.Email.ToUpper());;

                if (user == null)
                    throw new RestException(System.Net.HttpStatusCode.Unauthorized);

                var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                if (result.Succeeded)
                {
                    return new User
                    {
                        Username = user.UserName,
                        Token = _jwtGenerator.CreateToken(user),
                        DisplayName = user.DisplayName,
                        Image = user?.Images.FirstOrDefault(x => x.IsMain)?.Url
                    };
                }

                throw new RestException(System.Net.HttpStatusCode.Unauthorized);
            }
        }
    }
}