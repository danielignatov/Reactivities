using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }
            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Locale { get; set; }
        }

        public class CommandValidatior : AbstractValidator<Command>
        {
            public CommandValidatior()
            {
                RuleFor(x => x.DisplayName)
                .NotEmpty().WithMessage("DisplayName is required");

                RuleFor(x => x.Username)
                .NotEmpty().WithMessage("Username is required");

                RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Invalid email address");

                RuleFor(x => x.Password)
                .Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGeneratior;

            public Handler(
                DataContext context,
                UserManager<AppUser> userManager,
                IJwtGenerator jwtGeneratior)
            {
                _context = context;
                _userManager = userManager;
                _jwtGeneratior = jwtGeneratior;
            }

            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, "Email already exists");

                if (await _context.Users.AnyAsync(x => x.UserName == request.Username))
                    throw new RestException(System.Net.HttpStatusCode.BadRequest, "Username already exists");

                try
                {
                    var user = new AppUser
                    {
                        DisplayName = request.DisplayName,
                        Email = request.Email,
                        UserName = request.Username,
                        RegistrationDate = DateTime.UtcNow,
                        Locale = request.Locale
                    };

                    var result = await _userManager.CreateAsync(user, request.Password);

                    if (result.Succeeded)
                    {
                        return new User
                        {
                            DisplayName = user.DisplayName,
                            Token = _jwtGeneratior.CreateToken(user),
                            Username = user.UserName,
                            Locale = user.Locale
                        };
                    }

                    throw new Exception("Problem creating user");
                }
                catch (Exception)
                {
                    throw new RestException(
                        System.Net.HttpStatusCode.InternalServerError, 
                        "Problem creating user");
                }
            }
        }
    }
}