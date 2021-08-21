using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Enums;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class ResetPassword
    {
        public class Command : IRequest
        {
            public string ResetToken { get; set; }

            public string Password { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.ResetToken).NotEmpty();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            private readonly UserManager<AppUser> _userManager;

            private readonly IAuthTokenService _authTokenService;


            public Handler(
                DataContext context,
                UserManager<AppUser> userManager,
                IAuthTokenService authTokenService)
            {
                _context = context;
                _userManager = userManager;
                _authTokenService = authTokenService;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                try
                {
                    var tokenValidationResult =
                    await _authTokenService.ValidateAuthTokenAsync(request.ResetToken);

                    if (tokenValidationResult == AuthTokenValidationResult.Valid)
                    {
                        var user =
                            await _authTokenService.GetAppUserAsync(request.ResetToken);

                        user.PasswordHash =
                        _userManager.PasswordHasher.HashPassword(user, request.Password);

                        var result =
                        await _userManager.UpdateAsync(user);
                    }
                    else if (tokenValidationResult == AuthTokenValidationResult.Expired)
                    {
                        throw new RestException(
                            System.Net.HttpStatusCode.BadRequest,
                            "Expired auth token");
                    }
                    else
                    {
                        throw new RestException(
                            System.Net.HttpStatusCode.BadRequest,
                            "Invalid auth token");
                    }
                }
                catch (Exception)
                {
                    throw new RestException(
                        System.Net.HttpStatusCode.InternalServerError,
                        "Error during reset password process.");
                }

                return Unit.Value;
            }
        }
    }
}