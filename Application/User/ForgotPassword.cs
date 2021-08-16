using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class ForgotPassword
    {
        public class Command : IRequest
        {
            public string Email { get; set; }

            public string ResetPasswordUrl { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.ResetPasswordUrl).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            private readonly IEmailService _emailService;

            private readonly IAuthTokenService _authTokenService;

            public Handler(
                DataContext context,
                IEmailService emailService,
                IAuthTokenService authTokenService)
            {
                _context = context;
                _emailService = emailService;
                _authTokenService = authTokenService;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {

                var user =
                await _context
                .Users
                .SingleOrDefaultAsync(x => x.Email == request.Email);

                if (user == null)
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, "User not found");
                
                try
                {
                    var resetToken =
                    await _authTokenService.CreateAuthTokenAsync(user.Id, 24);

                    if (!request.ResetPasswordUrl.EndsWith('/'))
                        request.ResetPasswordUrl += '/';

                    var emailParameters =
                    new Dictionary<string, string>()
                    {
                        {"{Name}", user.DisplayName},
                        {"{Url}", request.ResetPasswordUrl + System.Web.HttpUtility.UrlEncode(resetToken) }
                    };

                    await _emailService.ForgotPassword(user.Email, emailParameters);
                }
                catch (Exception)
                {
                    throw new RestException(
                        System.Net.HttpStatusCode.InternalServerError,
                        "Error during forgot password process.");
                }

                return Unit.Value;
            }
        }
    }
}