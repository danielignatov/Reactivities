using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Infrastructure.Security
{
    public class IsImageUploaderRequirement : IAuthorizationRequirement
    {

    }

    public class IsImageUploaderRequirementHandler : AuthorizationHandler<IsImageUploaderRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsImageUploaderRequirementHandler(
            IHttpContextAccessor httpContextAccessor,
            DataContext context)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext authContext,
            IsImageUploaderRequirement requirement)
        {
            var httpContext = _httpContextAccessor.HttpContext;

            if (httpContext.Request.RouteValues.ContainsKey("id"))
            {
                var currentUserName =
                _httpContextAccessor.HttpContext.User?.Claims?
                .SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

                var imageId =
                    _httpContextAccessor.HttpContext.Request.RouteValues["id"].ToString();

                var user =
                    _context.Users.Include(x => x.Images).FirstOrDefault(x => x.UserName == currentUserName);

                if (user == null)
                    authContext.Fail();

                if (user.Images == null)
                    authContext.Fail();

                if (user.Images.Any(x => x.Id == imageId))
                    authContext.Succeed(requirement);
            }
            else
            {
                authContext.Fail();
            }

            return Task.CompletedTask;
        }
    }
}